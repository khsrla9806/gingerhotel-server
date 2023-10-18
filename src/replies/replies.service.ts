import { BadRequestException, Injectable } from '@nestjs/common';
import { Member } from 'src/entities/member.entity';
import { CreateReplyRequest } from './dto/create-reply.dto';
import { CommonResponse } from 'src/common/dto/output.dto';
import { DataSource, Repository } from 'typeorm';
import { LocalDate } from '@js-joda/core';
import { HotelWindow } from 'src/entities/hotel-window.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Hotel } from 'src/entities/hotel.entity';
import { Letter } from 'src/entities/letter.entity';
import { Reply } from 'src/entities/reply.entity';
import { MemberBlockHistory } from 'src/entities/member-block-history.entity';

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
    private readonly memberBlockRepository: Repository<MemberBlockHistory>,
    private readonly dataSource: DataSource
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
      const letter = await this.letterRepository
        .createQueryBuilder('letter')
        .innerJoinAndSelect('letter.sender', 'sender')
        .innerJoinAndSelect('letter.hotelWindow', 'hotelWindow')
        .innerJoinAndSelect('hotelWindow.hotel', 'hotel')
        .innerJoinAndSelect('hotel.member', 'member')
        .where('letter.id = :letterId', { letterId: letterId })
        .getOne();
      
      // 3. 존재하는 편지인지 & 삭제된 편지인지 확인
      if (!letter) {
        throw new BadRequestException('존재하지 않는 편지 정보입니다.');
      }

      if (letter.isDeleted) {
        throw new BadRequestException('삭제된 편지 정보입니다.');
      }
      
      // 4. 답장 수신자의 호텔 객체를 얻어옴
      let recipientsHotel: Hotel = await this.getRecipientsHotel(letter, loginMember);

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
      const recievedLetterCount = await this.getRecievedLetterCount(hotelWindow);
      const recipient: Member = await recipientsHotel.member;
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
      
      await queryRunner.commitTransaction();

      return {
        success: true
      }

    } catch (e) {
      await queryRunner.rollbackTransaction();
      
      return {
        success: false,
        error: e.message
      }
    } finally {
      await queryRunner.release();
    }
  }

  /**
   * @param letter: 답장의 대상이 되는 편지 객체
   * @param loginMember: 현재 로그인한 사용자 객체
   * @returns 답장 수신자의 호텔 객체를 반환
   */
  private async getRecipientsHotel(letter: Letter, loginMember: Member): Promise<Hotel> {

    let recipientsId = letter.sender.id;

    if (letter.sender.id === loginMember.id) {
      return letter.hotelWindow.hotel;
    }

    return await this.hotelRepository
      .createQueryBuilder('hotel')
      .innerJoinAndSelect('hotel.member', 'member')
      .where('hotel.member.id = :memberId', { memberId: recipientsId })
      .getOne();
  }

  /**
   * @param hotelWindow: 편지/답장 수신자의 호텔 창문 객체
   * @returns 해당 호텔 창문 날짜에 받은 모든 편지 수를 반환
   */
  private async getRecievedLetterCount(hotelWindow: HotelWindow): Promise<number> {
    const letterCount = await this.letterRepository
      .createQueryBuilder('letter')
      .where('letter.hotelWindow.id = :hotelWindowId and letter.isDeleted = false', { hotelWindowId: hotelWindow.id })
      .getCount();

    const replyCount = await this.replyRepository
      .createQueryBuilder('reply')
      .where('reply.hotelWindow.id = :hotelWindowId and reply.isDeleted = false', { hotelWindowId: hotelWindow.id })
      .getCount();

    return letterCount + replyCount;
  }

  /**
   * FREE 멤버쉽의 사용자의 경우 최대 수신 가능한 편지수를 넘은 경우를 확인하는 메서드
   * @param recievedLetterCount: 현재까지 받은 편지수
   */
  private checkMaximumReceivedLetterCount(recievedLetterCount: number) {
    const maximumReceivedLetterCount = 20; // 편지 수신 제한 개수 20개로 고정

    if (recievedLetterCount >= maximumReceivedLetterCount) {
      throw new BadRequestException(`수신자가 하루에 받을 수 있는 개수를 넘어섰습니다. : ${recievedLetterCount}`);
    }
  }

  /**
   * 답장 수신자의 창문의 개폐 여부를 판단하는 메서드
   * @param recievedLetterCount: 받은 편지수
   * @param hotelWindow: 호텔 창문 객체
   * @returns: 창문이 열리는 조건에 만족한 경우 true / 아닌 경우 false 반환
   */
  private checkHotelWindowOpenCondition(recievedLetterCount: number, hotelWindow: HotelWindow): boolean {
    const hotelWindowOpenConditionCount = 5; // 창문이 열리는 COUNT 5로 고정

    if (!hotelWindow.isOpen && recievedLetterCount >= hotelWindowOpenConditionCount) {
      hotelWindow.isOpen = true;
      hotelWindow.hasCookie = true;

      return true;
    }

    return false;
  }

  // TODO: 이미지 저장 메서드 (Storage 연결되면 이 부분에 이미지를 저장하는 로직 추가)
  private async saveImage(image: Express.Multer.File): Promise<string> {

    return '저장된 image URL';
  }

  /**
   * 답장 삭제 메서드
   */
  async deleteReply(replyId: number, loginMember: Member): Promise<CommonResponse> {
    try {
      // 1. 존재하는 답장인지 확인
      const reply = await this.replyRepository
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

    } catch (e) {
      return {
        success: false,
        error: e.message
      }
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
      const reply = await this.replyRepository
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
      const memberBlock = await this.memberBlockRepository
        .createQueryBuilder('memberBlock')
        .where(
          'memberBlock.fromMember.id = :fromMemberId and memberBlock.toMember.id = :toMemberId',
          { fromMemberId: loginMember.id, toMemberId: reply.sender.id }
        )
        .getOne();

      // 7. 이미 차단 관계가 있다면 count를 1 증가 후 UPDATE, 없다면 새로 만들어서 INSERT
      if (!memberBlock) {
        await queryRunner.manager.save(this.memberBlockRepository.create({
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
    } catch (e) {

      await queryRunner.rollbackTransaction();

      return {
        success: false,
        error: e.message
      }
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
      const reply = await this.replyRepository
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
      const memberBlock = await this.memberBlockRepository
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
    } catch (e) {

      await queryRunner.rollbackTransaction();

      return {
        success: false,
        error: e.message
      }
    } finally {
      await queryRunner.release();
    }
  }
}
