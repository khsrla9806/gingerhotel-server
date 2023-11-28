import { BadRequestException, ForbiddenException, Injectable } from '@nestjs/common';
import { Member } from 'src/entities/member.entity';
import { CreateLetterRequest } from '../dto/create-letter.dto';
import { DataSource, Repository, SelectQueryBuilder } from 'typeorm';
import { CommonResponse } from 'src/common/dto/output.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Hotel } from 'src/entities/hotel.entity';
import { LocalDate } from '@js-joda/core';
import { HotelWindow } from 'src/entities/hotel-window.entity';
import { Letter } from 'src/entities/letter.entity';
import { Reply } from 'src/entities/reply.entity';
import { MemberBlockHistory } from 'src/entities/member-block-history.entity';
import { LocalDateTimeConverter } from 'src/common/utils/local-date-time.converter';
import { GetRepliesResponse } from '../dto/get-replies.dto';
import { NotificationHistory } from 'src/entities/notification-history.entity';
import { NotificationType } from 'src/entities/domain/notification.type';
import { Feek } from 'src/entities/feek.entity';
import { S3Service, S3UploadResponse } from 'src/common/utils/s3.service';
import { LetterLimit } from 'src/entities/domain/letter-limit.type';
import { Device } from 'src/entities/device.entity';
import { DeviceStatus } from 'src/entities/domain/device-status.type';
import fetch from 'node-fetch';
import { ErrorCode } from 'src/common/filter/code/error-code.enum';

@Injectable()
export class LettersService {

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
   * 편지 생성 메서드
   */
  async createLetter(
    hotelId: number, loginMember: Member, image: Express.Multer.File, dto: CreateLetterRequest
  ): Promise<CommonResponse> {

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // 1. 존재하는 호텔인지 확인
      const hotel: Hotel = await this.hotelRepository
        .createQueryBuilder('hotel')
        .innerJoin('hotel.member', 'member')
        .select(['hotel', 'member.id', 'member.membership', 'member.feekCount'])
        .where('hotel.id = :hotelId and member.isActive = true', { hotelId: hotelId })
        .getOne();

      if (!hotel) {
        throw new BadRequestException(`존재하지 않는 호텔 정보입니다. : ${hotelId}`, ErrorCode.NotFoundResource);
      }

      // 내가 편지 보내려는 사용자가 나를 차단한 경우
      const memberBlock: MemberBlockHistory = await this.memberBlockHistoryRepository
        .createQueryBuilder('memberBlock')
        .where(
          'memberBlock.fromMember.id = :fromMemberId and memberBlock.toMember.id = :toMemberId',
          { fromMemberId: hotel.member.id, toMemberId: loginMember.id }
        )
        .getOne();
      
      if (memberBlock) {
        throw new BadRequestException('호텔 주인에 의해 차단된 사용자입니다.', ErrorCode.BlockedMemberFromHotelOwner);
      }

      // 2. 자신의 호텔인지 확인 (자기 호텔에는 편지를 쓰지 못함)
      if (hotel.member.id === loginMember.id) {
        throw new BadRequestException("자신의 호텔에는 편지를 쓸 수 없습니다.", ErrorCode.NotRequestOnesOwnSelf);
      }

      // 3. 이미지 파일 존재 여부 확인 + 광고 봤는지 여부 (TODO)
      if (image && false) {
        throw new BadRequestException("이미지 첨부기능을 사용할 수 없습니다.", ErrorCode.NotUseUploadImage);
      }

      // 4. 오늘 날짜 확인 (yyyy-MM-dd) 후 오늘 날짜에 해당하는 호텔 창문이 존재하는지 쿼리
      const today: LocalDate = LocalDate.now();
      let hotelWindow: HotelWindow = await this.hotelWindowRepository
        .createQueryBuilder('hotelWindow')
        .where('hotelWindow.date = :today and hotelWindow.hotel.id = :hotelId', { today: today, hotelId: hotel.id })
        .getOne();

      // 5. 창문이 존재하지 않는다면 창문을 생성
      if (!hotelWindow) {
        hotelWindow = await queryRunner.manager.save(this.hotelWindowRepository.create({
          hotel: hotel,
          date: today,
          isOpen: false,
          hasCookie: false,
          hasLimit: true
        }));
      }

      // 6. 받는 사람이 수신 편지 개수 제한이 있는지 확인
      const recievedLetterCount: number = await this.getRecievedLetterCount(hotelWindow);

      if (hotel.member.getMembershipInfo().hasLetterLimit) {
        let maxLetterCount: number = LetterLimit.limitCount;
        // 광고로 편지 제한을 풀어서 hotelWindow의 hasLimit가 false인 경우에는 maxLetterCount가 100으로 설정
        if (!hotelWindow.hasLimit) {
          maxLetterCount = LetterLimit.unlimitCount;
        }
        this.checkMaximumReceivedLetterCount(maxLetterCount, recievedLetterCount);
      }

      // 7. 이미지와 편지 저장
      const imageURL: string = await this.saveImage(image);

      await queryRunner.manager.save(this.letterRepository.create({
        hotelWindow: hotelWindow,
        sender: loginMember,
        senderNickname: dto.senderNickname,
        content: dto.content,
        imageUrl: imageURL,
        isDeleted: false,
        isBlocked: false
      }));

      // 8. 편지 알림 Data Object 생성
      const letterTypeDataObject = {
        hotelId: hotel.id,
        date: today.toString()
      };

      let notificationMessage: string;

      // 9. 편지를 받아서 창문이 열리는 경우에는 창문 열림 알림을 보내고, 열리지 않은 경우에는 편지 도착 알림을 보낸다.
      if (this.checkHotelWindowOpenCondition(recievedLetterCount + 1, hotelWindow)) {
        await queryRunner.manager.save(hotelWindow);
        notificationMessage = '오늘의 창문이 열렸어요! 확인하러 갈까요?';
        await queryRunner.manager.save(queryRunner.manager.getRepository(NotificationHistory).create({
          member: hotel.member,
          type: NotificationType.WINDOW_OPEN,
          typeData: JSON.stringify(letterTypeDataObject),
          message: notificationMessage,
          isChecked: false
        }));

        // 호텔 주인의 엿보기 개수를 5개 증가시키는 로직 (창문이 열리면 엿보기 5개를 제공함)
        await queryRunner.manager.query(
          'UPDATE member SET feek_count = $1 WHERE id = $2',
          [hotel.member.feekCount + 5, hotel.member.id]
        );

      } else {
        notificationMessage = '두근두근! 새 편지 도착!';
        const notification: NotificationHistory = queryRunner.manager
          .getRepository(NotificationHistory)
          .create({
            member: hotel.member,
            type: NotificationType.LETTER,
            typeData: JSON.stringify(letterTypeDataObject),
            message: notificationMessage,
            isChecked: false
          });
        await queryRunner.manager.save(notification);
      }

      /* TEMP: 푸시 알림 기능 주석 처리
      // 10. 디바이스가 존재한다면 푸시 알림을 보냄
      const devices: Device[] = await queryRunner.manager.getRepository(Device)
        .createQueryBuilder('device')
        .where('device.member.id = :memberId', { memberId: hotel.member.id })
        .getMany();

      // 푸시 알림을 못 보내면 그만이기 때문에 try-catch로 잡아서 예외를 그냥 버림 (푸시 알림 때문에 편지가 안 보내지면 안 되기 때문에)
      try {
        if (devices && devices.length > 0) {
          // device를 순회하면서 push 알림을 보냄
          for (let i = 0; i < devices.length; i++) {
            const device: Device = devices[i];
            if (device.status === DeviceStatus.granted) {
              const message = {
                to: device.token,
                sound: 'default',
                title: notificationMessage,
                body: '',
                data: letterTypeDataObject
              }
              fetch("https://exp.host/--/api/v2/push/send", {
                method: "POST",
                headers: {
                  Accept: "application/json",
                  "Accept-encoding": "gzip, deflate",
                  "Content-Type": "application/json",
                },
                body: JSON.stringify(message),
              });
            }
          }
        }
      } catch (error) {}
      */
      
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

  private checkMaximumReceivedLetterCount(maxLetterCount: number, recievedLetterCount: number) {
    if (recievedLetterCount >= maxLetterCount) {
      throw new BadRequestException(`수신자가 하루에 받을 수 있는 개수를 넘어섰습니다. : ${recievedLetterCount}`, ErrorCode.LetterReceivedLimitExceed);
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

  /**
   * 편지 삭제 메서드
   */
  async deleteLetter(letterId: number, loginMember: Member): Promise<CommonResponse> {
    
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {

      // 1. 존재하는 편지인지 확인
      const letter: Letter = await this.letterRepository
        .createQueryBuilder('letter')
        .innerJoin('letter.hotelWindow', 'hotelWindow')
        .innerJoin('hotelWindow.hotel', 'hotel')
        .innerJoin('hotel.member', 'member')
        .select(['letter', 'hotelWindow.id', 'hotel.id', 'member.id'])
        .where('letter.id = :letterId and letter.isDeleted = false', { letterId: letterId })
        .getOne();

      if (!letter) {
        throw new BadRequestException(`존재하지 않는 편지 정보입니다. : ${letterId}`, ErrorCode.NotFoundResource);
      }

      // 2. 편지 받은 사람과 삭제 요청한 사람과 동일한지 확인
      if (letter.hotelWindow.hotel.member.id !== loginMember.id) {
        throw new BadRequestException('자신이 받은 편지만 삭제할 수 있습니다.', ErrorCode.AccessDenied);
      }

      // 3. 해당 편지와 관련된 답장들을 모두 삭제 처리
      await queryRunner.query(`UPDATE reply SET is_deleted = true WHERE letter_id = ${letterId}`);
      
      // 4. 해당 편지도 삭제
      await queryRunner.query(`UPDATE letter SET is_deleted = true WHERE id = ${letterId}`);

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
   * 내가 답장을 보내려고 하는 사람이 날 차단했는지 확인하는 메서드
   */
  async checkBlocked(letterId: number, loginMember: Member) {
    try {
      const letter: Letter = await this.letterRepository
        .createQueryBuilder('letter')
        .innerJoin('letter.sender', 'sender')
        .innerJoin('letter.hotelWindow', 'hotelWindow')
        .innerJoin('hotelWindow.hotel', 'hotel')
        .innerJoin('hotel.member', 'member')
        .select(['letter', 'sender.id', 'hotelWindow.id', 'hotel.id', 'member.id'])
        .where('letter.id = :letterId and letter.isDeleted = false', { letterId: letterId })
        .getOne();

      if (!letter) {
        throw new BadRequestException('존재하지 않는 편지 정보입니다.', ErrorCode.NotFoundResource);
      }

      const letterSenderId: number = letter.sender.id;
      const letterRecipientId: number = letter.hotelWindow.hotel.member.id;

      if (letterRecipientId !== loginMember.id && letterSenderId !== loginMember.id) {
        throw new ForbiddenException('접근 권한이 없습니다.', ErrorCode.AccessDenied);
      }

      const fromMemberId: number = letterSenderId === loginMember.id ? letterRecipientId : letterSenderId;

      const blockHistory: MemberBlockHistory = await this.memberBlockHistoryRepository
        .createQueryBuilder('blockHistory')
        .where(
          'blockHistory.fromMember.id = :fromMemberId and blockHistory.toMember.id = :toMemberId',
          { fromMemberId: fromMemberId, toMemberId: loginMember.id }
        )
        .getOne();

      if (blockHistory) {
        return {
          success: true,
          isBlockMe: true,
          message: "상대방이 나를 차단했습니다."
        }
      }
      
      return {
        success: true,
        isBlockMe: false,
        message: "상대방이 나를 차단하지 않았습니다."
      }

    } catch (error) {
      throw error;
    }
  }

  /**
   * 편지 차단 메서드
   */
  async blockLetter(letterId: number, loginMember: Member) {
    
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // 1. 존재하는 편지인지 확인
      const letter: Letter = await this.letterRepository
        .createQueryBuilder('letter')
        .innerJoin('letter.sender', 'sender')
        .innerJoin('letter.hotelWindow', 'hotelWindow')
        .innerJoin('hotelWindow.hotel', 'hotel')
        .innerJoin('hotel.member', 'member')
        .select(['letter', 'sender.id', 'hotelWindow.id', 'hotel.id', 'member.id'])
        .where('letter.id = :letterId and letter.isDeleted = false', { letterId: letterId })
        .getOne();

      if (!letter) {
        throw new BadRequestException('존재하지 않는 편지 정보입니다.', ErrorCode.NotFoundResource);
      }

      // 2. 편지를 받은 사람과 로그인한 사용자와 같은지 확인 (자신이 받은 편지만 차단이 가능)
      if (letter.hotelWindow.hotel.member.id !== loginMember.id) {
        throw new BadRequestException('내가 받은 편지만 차단할 수 있습니다.', ErrorCode.AccessDenied);
      }

      // 3. 이미 차단 되어 있는 편지인지 확인
      if (letter.isBlocked) {
        throw new BadRequestException('이미 차단된 편지입니다.', ErrorCode.AlreadyBlockedLetter)
      }

      // 4. 관련된 답장들 중에서 sender가 letterSender와 같은  isBlocked를 모두 true로 변경
      await queryRunner.query(
        `UPDATE reply SET is_blocked = true WHERE letter_id = ${letter.id} and sender_id = ${letter.sender.id}`
      );

      // 5. 해당 편지 차단
      await queryRunner.query(
        `UPDATE letter SET is_blocked = true WHERE id = ${letter.id}`
      );

      // 6. 로그인한 사용자(fromMember)와 편지를 보낸 사람(toMember)의 차단 관계를 형성
      const memberBlockHistory: MemberBlockHistory = await this.memberBlockHistoryRepository
        .createQueryBuilder('memberBlock')
        .where(
          'memberBlock.fromMember.id = :fromMemberId and memberBlock.toMember.id = :toMemberId',
          { fromMemberId: loginMember.id, toMemberId: letter.sender.id }
        )
        .getOne();

      // 7. 이미 차단된 내역이 있으면 count를 1증가한 후 UPDATE, 없으면 count를 1로 새로 만들어서 INSERT
      if (!memberBlockHistory) {
        await queryRunner.manager.save(this.memberBlockHistoryRepository.create({
          fromMember: loginMember,
          toMember: letter.sender,
          count: 1
        }));
      } else {
        await queryRunner.query(
          `UPDATE member_block_history SET count = ${memberBlockHistory.count + 1} WHERE id = ${memberBlockHistory.id}`
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
   * 편지 차단 해제
   */
  async unblockLetter(letterId: number, loginMember: Member) {

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // 1. 존재하는 편지인지 확인
      const letter: Letter = await this.letterRepository
        .createQueryBuilder('letter')
        .innerJoin('letter.sender', 'sender')
        .innerJoin('letter.hotelWindow', 'hotelWindow')
        .innerJoin('hotelWindow.hotel', 'hotel')
        .innerJoin('hotel.member', 'member')
        .select(['letter', 'sender.id', 'hotelWindow.id', 'hotel.id', 'member.id'])
        .where('letter.id = :letterId and letter.isDeleted = false', { letterId: letterId })
        .getOne();

      if (!letter) {
        throw new BadRequestException('존재하지 않는 편지 정보입니다.', ErrorCode.NotFoundResource);
      }

      // 2. 편지를 받은 사람과 로그인한 사용자와 같은지 확인 (자신이 받은 편지만 차단 해제 가능)
      if (letter.hotelWindow.hotel.member.id !== loginMember.id) {
        throw new BadRequestException('내가 받은 편지만 차단 해제할 수 있습니다.', ErrorCode.AccessDenied);
      }

      // 3. 차단 되어 있지 않는 편지인지 확인
      if (!letter.isBlocked) {
        throw new BadRequestException('차단 되어 있지 않은 편지입니다.', ErrorCode.NoBlockedLetter)
      }

      // 4. 관련된 답장들 중에서 sender가 letterSender와 같은  isBlocked를 모두 false로 변경
      await queryRunner.query(
        `UPDATE reply SET is_blocked = false WHERE letter_id = ${letter.id} and sender_id = ${letter.sender.id}`
      );

      // 5. 해당 편지 차단 해제
      await queryRunner.query(
        `UPDATE letter SET is_blocked = false WHERE id = ${letter.id}`
      );

      // 6. 로그인한 사용자(fromMember)와 편지를 보낸 사람(toMember)의 차단 관계를 해제
      const memberBlockHistory: MemberBlockHistory = await this.memberBlockHistoryRepository
        .createQueryBuilder('memberBlock')
        .where(
          'memberBlock.fromMember.id = :fromMemberId and memberBlock.toMember.id = :toMemberId',
          { fromMemberId: loginMember.id, toMemberId: letter.sender.id }
        )
        .getOne();

      // 7. 이미 차단된 내역이 있으면 count를 확인
      if (memberBlockHistory) {
        const minusCount = memberBlockHistory.count - 1;

        if (minusCount <= 0) {
          await queryRunner.query(
            `DELETE FROM member_block_history WHERE id = ${memberBlockHistory.id}`
          );
        } else {
          await queryRunner.query(
            `UPDATE member_block_history SET count = ${minusCount} WHERE id = ${memberBlockHistory.id}`
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

  /**
   * 내 편지함 조회
   */
  async getLetters(hotelId: number, date: LocalDate, loginMember: Member) {
    try {
      // 1. 내호텔 확인
      const hotel: Hotel = await this.hotelRepository
        .createQueryBuilder('hotel')
        .innerJoin('hotel.member', 'member')
        .select(['hotel', 'member.id'])
        .where('hotel.id = :hotelId', { hotelId: hotelId })
        .getOne();
      

      if (!hotel) {
        throw new BadRequestException('존재하지 않는 호텔 정보입니다.', ErrorCode.NotFoundResource);
      }

      if (hotel.member.id !== loginMember.id) {
        throw new BadRequestException('내 호텔의 편지만 확인할 수 있습니다.', ErrorCode.AccessDenied);
      }

      // 2. 오늘 날짜에 해당하는 창문을 탐색
      const hotelWindow: HotelWindow = await this.hotelWindowRepository
        .createQueryBuilder('hotelWindow')
        .where(
          'hotelWindow.hotel.id = :hotelId and hotelWindow.date = :date', 
          { hotelId: hotel.id, date: date }
        )
        .getOne();

      if (!hotelWindow) {
        throw new BadRequestException(`${date}에 받은 편지가 존재하지 않습니다.`, ErrorCode.EmptyWindow);
      }

      if (!hotelWindow.isOpen) {
        throw new BadRequestException(`${date} 창문이 닫혀있습니다.`, ErrorCode.WindowClosed);
      }

      // 3. 오늘 날짜에 해당하는 편지를 내림차순으로 정렬
      const letters: Letter[] = await this.letterRepository
        .createQueryBuilder('letter')
        .leftJoin('feek', 'feek', 'feek.letter.id = letter.id')
        .select('letter.id', 'id')
        .addSelect('letter.senderNickname', 'senderNickname')
        .addSelect('letter.content', 'content')
        .addSelect('letter.imageUrl', 'imageUrl')
        .addSelect('letter.isBlocked', 'isBlocked')
        .addSelect('letter.createdAt', 'createdAt')
        .addSelect('feek.feekStatus', 'feekStatus')
        .addSelect('feek.comment', 'feekComment')
        .where('letter.hotelWindow.id = :hotelWindowId and letter.isDeleted = false', { hotelWindowId: hotelWindow.id })
        .orderBy('letter.createdAt', 'DESC')
        .getRawMany();

      LocalDateTimeConverter.convertCreatedAtToLocalDateTimeInList(letters);

      // 4. 오늘 날짜에 해당하는 답장을 내림차순으로 정렬
      const replies: Reply[] = await this.replyRepository
        .createQueryBuilder('reply')
        .innerJoin('reply.letter', 'letter')
        .select('reply.id', 'id')
        .addSelect('letter.id', 'letterId')
        .addSelect('letter.senderNickname', 'senderNickname')
        .addSelect('reply.content', 'content')
        .addSelect('reply.imageUrl', 'imageUrl')
        .addSelect('reply.isBlocked', 'isBlocked')
        .addSelect('reply.createdAt', 'createdAt')
        .where('reply.hotelWindow.id = :hotelWindowId and reply.isDeleted = false', { hotelWindowId: hotelWindow.id })
        .orderBy('reply.createdAt', 'DESC')
        .getRawMany();

      LocalDateTimeConverter.convertCreatedAtToLocalDateTimeInList(replies);

      return {
        success: true,
        letters: letters,
        replies: replies
      }
    } catch (error) {
      throw error;
    }
  }

  /**
   * 답장 모아보기
   */
  async getReplies(letterId: number, sort: string, loginMember: Member) {
    try {
      // 1. 존재하는 편지인지 확인
      const letter: Letter = await this.letterRepository
        .createQueryBuilder('letter')
        .innerJoin('letter.sender', 'sender')
        .innerJoin('letter.hotelWindow', 'hotelWindow')
        .innerJoin('hotelWindow.hotel', 'hotel')
        .innerJoin('hotel.member', 'member')
        .select([
          'letter', 
          'sender.id', 
          'hotelWindow.id', 'hotelWindow.isOpen', 'hotelWindow.date', 
          'hotel.id', 'hotel.nickname',
          'member.id'
        ])
        .where('letter.id = :letterId and letter.isDeleted = false', { letterId: letterId })
        .getOne();

      if (!letter) {
        throw new BadRequestException('존재하지 않는 편지 정보입니다.', ErrorCode.NotFoundResource);
      }

      // 2. 답장 모아보기 조회 권한을 확인
      const letterOwnerId = letter.hotelWindow.hotel.member.id;

      if (loginMember.id !== letter.sender.id && loginMember.id !== letterOwnerId) {
        throw new ForbiddenException('편지 주인과 편지를 보낸 사람만 조회가 가능합니다.', ErrorCode.AccessDenied);
      }

      // 3. 해당 편지와 연관된 답장 목록을 가져옴 (쿼리 빌더 생성)
      let replyQueryBuilder: SelectQueryBuilder<Reply> = this.replyRepository
        .createQueryBuilder('reply')
        .innerJoin('reply.sender', 'sender')
        .innerJoin('reply.hotelWindow', 'hotelWindow')
        .innerJoin('reply.letter', 'letter', 'letter.id = :letterId', { letterId: letter.id })
        .select([
          'reply', 
          'sender.id',
          'hotelWindow.id', 'hotelWindow.isOpen', 'hotelWindow.date'
        ])
        .where('reply.isDeleted = false');

      // 4. 정렬 조건에 따른 orderBy 조건 추가
      replyQueryBuilder = this.addOrderByToReplyQueryBuilder(replyQueryBuilder, sort);

      const replies: Reply[] = await replyQueryBuilder.getMany();

      const feek: Feek = await this.dataSource.getRepository(Feek)
        .createQueryBuilder('feek')
        .select(['feek.feekStatus', 'feek.comment'])
        .where('feek.letter.id = :letterId', { letterId: letter.id })
        .getOne();

      return new GetRepliesResponse(letter, feek, replies, loginMember);

    } catch (error) {
      throw error;
    }
  }

  private addOrderByToReplyQueryBuilder(
    queryBuilder: SelectQueryBuilder<Reply>, 
    sort: string
  ): SelectQueryBuilder<Reply> {

    if (sort && sort === 'ASC') {
      queryBuilder = queryBuilder.orderBy('reply.createdAt', 'ASC');
    } else {
      queryBuilder = queryBuilder.orderBy('reply.createdAt', 'DESC');
    }

    return queryBuilder;
  }
}
