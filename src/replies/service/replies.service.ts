import { BadRequestException, ForbiddenException, Injectable } from '@nestjs/common';
import { Member } from 'src/entities/member.entity';
import { CreateReplyRequest } from '../dto/create-reply.dto';
import { CommonResponse } from 'src/common/dto/output.dto';
import { DataSource, Repository } from 'typeorm';
import { LocalDate } from '@js-joda/core';
import { HotelWindow } from 'src/entities/hotel-window.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Hotel } from 'src/entities/hotel.entity';
import { Letter } from 'src/entities/letter.entity';
import { Reply } from 'src/entities/reply.entity';
import { MemberBlockHistory } from 'src/entities/member-block-history.entity';
import { NotificationHistory } from 'src/entities/notification-history.entity';
import { NotificationType } from 'src/entities/domain/notification.type';
import { S3Service, S3UploadResponse } from 'src/common/utils/s3.service';

@Injectable()
export class RepliesService {

  constructor(
    @InjectRepository(Hotel)
    private readonly hotelRepository: Repository<Hotel>,
    @InjectRepository(HotelWindow)
    private readonly hotelWindowRepository: Repository<HotelWindow>,
    @InjectRepository(Letter)
    private readonly letterRepository: Repository<Letter>,
    @InjectRepository(Reply)
    private readonly replyRepository: Repository<Reply>,
    @InjectRepository(MemberBlockHistory)
    private readonly memberBlockHistoryRepository: Repository<MemberBlockHistory>,
    private readonly dataSource: DataSource,
    private readonly s3Service: S3Service
  ) {}

  /**
   * 답장 생성 메서드
   */
  async createReply(
    letterId: number, loginMember: Member, image: Express.Multer.File, dto: CreateReplyRequest): Promise<CommonResponse> {

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // 1. 요청한 사용자의 멤버쉽이 답장 기능을 사용할 수 있는지 확인
      if (!loginMember.getMembershipInfo().isPossibleReply) {
        throw new BadRequestException(`답장 기능을 사용할 수 없는 멤버쉽의 사용자입니다. : ${loginMember.membership}`);
      }

      // 2. 존재하는 편지인지 확인
      const letter: Letter = await this.letterRepository
        .createQueryBuilder('letter')
        .innerJoin('letter.sender', 'sender')
        .innerJoin('letter.hotelWindow', 'hotelWindow')
        .innerJoin('hotelWindow.hotel', 'hotel')
        .innerJoin('hotel.member', 'member')
        .select([
          'letter', 'sender.id', 'hotelWindow.id', 'hotel.id', 'hotel.nickname', 
          'member.id', 'member.isActive', 'member.membership'
        ])
        .where('letter.id = :letterId', { letterId: letterId })
        .getOne();
      
      // 3. 존재하는 편지인지 & 삭제된 편지인지 확인
      if (!letter) {
        throw new BadRequestException('존재하지 않는 편지 정보입니다.');
      }

      if (letter.isDeleted) {
        throw new BadRequestException('삭제된 편지 정보입니다.');
      }

      // 최초 편지를 보낸 사람 또는 최초 편지를 받은 사람이 맞는지 확인 (제3 자는 답장을 못보냄)
      if (letter.hotelWindow.hotel.member.id !== loginMember.id && letter.sender.id !== loginMember.id) {
        throw new ForbiddenException('권한이 없습니다.');
      }
      
      // 4. 답장 수신자의 호텔 객체를 얻어옴
      let recipientsHotel: Hotel = await this.getRecipientsHotel(letter, loginMember);

      if (!recipientsHotel) {
        throw new BadRequestException('존재하지 않는 호텔 정보입니다.');
      }

      // 내가 편지 보내려는 사용자가 나를 차단한 경우
      const memberBlock: MemberBlockHistory = await this.memberBlockHistoryRepository
        .createQueryBuilder('memberBlock')
        .where(
          'memberBlock.fromMember.id = :fromMemberId and memberBlock.toMember.id = :toMemberId',
          { fromMemberId: recipientsHotel.member.id, toMemberId: loginMember.id }
        )
        .getOne();
      
      if (memberBlock) {
        throw new BadRequestException('호텔 주인에 의해 차단된 사용자입니다.');
      }

      // 5. 이미지 파일 존재 여부 확인 (member의 멤버쉽 체크)
      if (image && !loginMember.getMembershipInfo().isPossibleAttachImage) {
        throw new BadRequestException("이미지 첨부를 할 수 없는 멤버쉽 정보입니다.");
      }

      // 5. 오늘 날짜 확인 (yyyy-MM-dd) 후 오늘 날짜에 해당하는 호텔 창문이 존재하는지 쿼리
      const today: LocalDate = LocalDate.now();
      let hotelWindow: HotelWindow = await this.hotelWindowRepository
        .createQueryBuilder('hotelWindow')
        .where('hotelWindow.date = :today and hotelWindow.hotel.id = :hotelId', { today: today, hotelId: recipientsHotel.id })
        .getOne();

      // 6. 창문이 존재하지 않는다면 창문을 생성
      if (!hotelWindow) {
        hotelWindow = await queryRunner.manager.save(this.hotelWindowRepository.create({
          hotel: recipientsHotel,
          date: today,
          isOpen: false,
          hasCookie: false
        }));
      }

      // 7. 답장 수신자의 편지 개수 제한을 확인
      const recievedLetterCount: number = await this.getRecievedLetterCount(hotelWindow);
      const recipient: Member = recipientsHotel.member;
      if (recipient.getMembershipInfo().hasLetterLimit) {
        this.checkMaximumReceivedLetterCount(recievedLetterCount);
      }

      // 8. 이미지와 편지 저장
      const imageURL: string = await this.saveImage(image);

      await queryRunner.manager.save(this.replyRepository.create({
        hotelWindow: hotelWindow,
        sender: loginMember,
        letter: letter,
        content: dto.content,
        isDeleted: false,
        isBlocked: false,
        imageUrl: imageURL
      }));

      // 9. 편지를 받는 사람이 받아야 하는 편지수를 채운 경우 창문 OPEN
      if (this.checkHotelWindowOpenCondition(recievedLetterCount + 1, hotelWindow)) {
        await queryRunner.manager.save(hotelWindow); // Update 반영
      }

      // 10. 답장 수신자에게 알림을 추가
      const replyTypeDataObject = {
        letterId: letter.id
      };
      const replySenderNickname: string = this.getReplySenderNickname(letter, loginMember);
      const notification: NotificationHistory = queryRunner.manager
        .getRepository(NotificationHistory)
        .create({
          member: recipient,
          type: NotificationType.REPLY,
          typeData: JSON.stringify(replyTypeDataObject),
          message: `${replySenderNickname}님으로부터 답장이 도착했어요!`,
          isChecked: false
        });
      await queryRunner.manager.save(notification);
      
      await queryRunner.commitTransaction();

      return {
        success: true
      }

    } catch (error) {
      await queryRunner.rollbackTransaction();
      
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  private async getRecipientsHotel(letter: Letter, loginMember: Member): Promise<Hotel> {

    if (letter.sender.id === loginMember.id) { // 편지를 보낸 사람이 로그인한 사용자라면 답장 수신자는 편지의 주인
      if (!letter.hotelWindow.hotel.member.isActive) {
        throw new BadRequestException('답장 수신자는 탈퇴한 사용자입니다.');
      }

      return letter.hotelWindow.hotel;
    }

    return await this.hotelRepository
      .createQueryBuilder('hotel')
      .innerJoin('hotel.member', 'member')
      .select(['hotel', 'member.id', 'member.isActive', 'member.membership'])
      .where('member.id = :memberId and member.isActive = true', { memberId: letter.sender.id })
      .getOne();
  }

  private async getRecievedLetterCount(hotelWindow: HotelWindow): Promise<number> {
    const letterCount: number = await this.letterRepository
      .createQueryBuilder('letter')
      .where('letter.hotelWindow.id = :hotelWindowId and letter.isDeleted = false', { hotelWindowId: hotelWindow.id })
      .getCount();

    const replyCount: number = await this.replyRepository
      .createQueryBuilder('reply')
      .where('reply.hotelWindow.id = :hotelWindowId and reply.isDeleted = false', { hotelWindowId: hotelWindow.id })
      .getCount();

    return letterCount + replyCount;
  }

  private checkMaximumReceivedLetterCount(recievedLetterCount: number) {
    const maximumReceivedLetterCount = 20; // 편지 수신 제한 개수 20개로 고정

    if (recievedLetterCount >= maximumReceivedLetterCount) {
      throw new BadRequestException(`수신자가 하루에 받을 수 있는 개수를 넘어섰습니다. : ${recievedLetterCount}`);
    }
  }

  private checkHotelWindowOpenCondition(recievedLetterCount: number, hotelWindow: HotelWindow): boolean {
    const hotelWindowOpenConditionCount = 5; // 창문이 열리는 COUNT 5로 고정

    if (!hotelWindow.isOpen && recievedLetterCount >= hotelWindowOpenConditionCount) {
      hotelWindow.isOpen = true;
      hotelWindow.hasCookie = true;

      return true;
    }

    return false;
  }

  private async saveImage(image: Express.Multer.File): Promise<string> {
    if (!image) {
      return null;
    }
    const s3UploadResponse: S3UploadResponse = await this.s3Service.uploadToS3(image);

    return s3UploadResponse.url;
  }

  private getReplySenderNickname(letter: Letter, loginMember: Member) {
    return letter.sender.id === loginMember.id ? letter.senderNickname : letter.hotelWindow.hotel.nickname;
  }

  /**
   * 답장 삭제 메서드
   */
  async deleteReply(replyId: number, loginMember: Member): Promise<CommonResponse> {
    try {
      // 1. 존재하는 답장인지 확인
      const reply: Reply = await this.replyRepository
      .createQueryBuilder('reply')
      .innerJoinAndSelect('reply.hotelWindow', 'hotelWindow')
      .innerJoinAndSelect('hotelWindow.hotel', 'hotel')
      .innerJoinAndSelect('hotel.member', 'member')
      .where('reply.id = :replyId and reply.isDeleted = false', { replyId: replyId })
      .getOne();

      if (!reply) {
        throw new BadRequestException(`존재하지 않는 답장 정보입니다. : ${replyId}`);
      }

      // 2. 삭제하려는 사람이 받은 편지가 맞는지 확인
      if (reply.hotelWindow.hotel.member.id !== loginMember.id) {
        throw new BadRequestException('내가 받은 답장만 삭제할 수 있습니다.');
      }

      // 3. 답장 삭제
      reply.isDeleted = true;
      await this.replyRepository.save(reply);

      return {
        success: true
      }

    } catch (error) {
      throw error;
    }
  }

  /**
   * 답장 차단 메서드
   */
  async blockReply(replyId: number, loginMember: Member) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    
    try {
      // 1. 존재하는 답장인지 확인 (식별자만 Projection)
      const reply: Reply = await this.replyRepository
        .createQueryBuilder('reply')
        .innerJoin('reply.sender', 'sender')
        .innerJoin('reply.letter', 'letter')
        .innerJoin('letter.sender', 'letterSender')
        .innerJoin('reply.hotelWindow', 'hotelWindow')
        .innerJoin('hotelWindow.hotel', 'hotel')
        .innerJoin('hotel.member', 'member')
        .select(['reply', 'sender.id', 'letter.id', 'letterSender.id', 'hotelWindow.id', 'hotel.id', 'member.id'])
        .where('reply.id = :replyId and reply.isDeleted = false', { replyId: replyId })
        .getOne();

      // 2. 내가 받은 답장이 맞는지 확인
      if (reply.hotelWindow.hotel.member.id !== loginMember.id) {
        throw new BadRequestException('내가 받은 답장만 차단이 가능합니다.');
      }

      // 3. 이미 차단된 답장인지 확인
      if (reply.isBlocked) {
        throw new BadRequestException('이미 차단된 답장입니다.');
      }

      // 4. 이 답장을 포함해서 관련된(reply.sender가 동일한) 다른 답장들의 isBlocked를 true로 변경
      await queryRunner.query(
        `UPDATE reply SET is_blocked = true WHERE letter_id = ${reply.letter.id} and sender_id = ${reply.sender.id}`
      );

      // 5. 이 답장의 시작이 된 편지를 보낸 사람이 동알하다면 편지도 차단
      if (reply.letter.sender.id === reply.sender.id) {
        await queryRunner.query(
          `UPDATE letter SET is_blocked = true WHERE id = ${reply.letter.id}`
        );
      }

      // 6. 나(loginMember)와 답장을 보낸 사람(reply.sender) 사이의 차단 관계를 형성
      const memberBlock: MemberBlockHistory = await this.memberBlockHistoryRepository
        .createQueryBuilder('memberBlock')
        .where(
          'memberBlock.fromMember.id = :fromMemberId and memberBlock.toMember.id = :toMemberId',
          { fromMemberId: loginMember.id, toMemberId: reply.sender.id }
        )
        .getOne();

      // 7. 이미 차단 관계가 있다면 count를 1 증가 후 UPDATE, 없다면 새로 만들어서 INSERT
      if (!memberBlock) {
        await queryRunner.manager.save(this.memberBlockHistoryRepository.create({
          fromMember: loginMember,
          toMember: reply.sender,
          count: 1
        }));
      } else {
        await queryRunner.query(
          `UPDATE member_block_history SET count = ${memberBlock.count + 1} WHERE id = ${memberBlock.id}`
        );
      }

      await queryRunner.commitTransaction();

      return {
        success: true
      }
    } catch (error) {
      await queryRunner.rollbackTransaction();

      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  /**
   * 답장 차단 해제 메서드
   */
  async unblockReply(replyId: number, loginMember: Member) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    
    try {
      // 1. 존재하는 답장인지 확인 (식별자만 Projection)
      const reply: Reply = await this.replyRepository
        .createQueryBuilder('reply')
        .innerJoin('reply.sender', 'sender')
        .innerJoin('reply.letter', 'letter')
        .innerJoin('letter.sender', 'letterSender')
        .innerJoin('reply.hotelWindow', 'hotelWindow')
        .innerJoin('hotelWindow.hotel', 'hotel')
        .innerJoin('hotel.member', 'member')
        .select(['reply', 'sender.id', 'letter.id', 'letterSender.id', 'hotelWindow.id', 'hotel.id', 'member.id'])
        .where('reply.id = :replyId and reply.isDeleted = false', { replyId: replyId })
        .getOne();

      // 2. 내가 받은 답장이 맞는지 확인
      if (reply.hotelWindow.hotel.member.id !== loginMember.id) {
        throw new BadRequestException('내가 받은 답장만 차단 해제가 가능합니다.');
      }

      // 3. 차단된 답장인지 확인
      if (!reply.isBlocked) {
        throw new BadRequestException('차단되어 있지 않은 답장입니다.');
      }

      // 4. 이 답장을 포함해서 관련된(reply.sender가 동일한) 다른 답장들의 isBlocked를 false로 변경
      await queryRunner.query(
        `UPDATE reply SET is_blocked = false WHERE letter_id = ${reply.letter.id} and sender_id = ${reply.sender.id}`
      );

      // 5. 이 답장의 시작이 된 편지를 보낸 사람이 동알하다면 편지도 차단 해제
      if (reply.letter.sender.id === reply.sender.id) {
        await queryRunner.query(
          `UPDATE letter SET is_blocked = false WHERE id = ${reply.letter.id}`
        );
      }

      // 6. 나(loginMember)와 답장을 보낸 사람(reply.sender) 사이의 차단 관계를 형성
      const memberBlock: MemberBlockHistory = await this.memberBlockHistoryRepository
        .createQueryBuilder('memberBlock')
        .where(
          'memberBlock.fromMember.id = :fromMemberId and memberBlock.toMember.id = :toMemberId',
          { fromMemberId: loginMember.id, toMemberId: reply.sender.id }
        )
        .getOne();

      // 7. 이미 차단 관계가 있다면 count를 -1 감소후 count가 0 이하인지 확인하고, 0 이하면 없앰
      if (memberBlock) {
        const minusCount = memberBlock.count - 1;

        if (minusCount <= 0) {
          await queryRunner.query(`DELETE FROM member_block_history WHERE id = ${memberBlock.id}`);
        } else {
          await queryRunner.query(
            `UPDATE member_block_history SET count = ${minusCount} WHERE id = ${memberBlock.id}`
          );
        }
      }

      await queryRunner.commitTransaction();

      return {
        success: true
      }
    } catch (error) {

      await queryRunner.rollbackTransaction();

      throw error;
    } finally {
      await queryRunner.release();
    }
  }
}
