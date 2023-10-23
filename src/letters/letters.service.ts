import { BadRequestException, Injectable } from '@nestjs/common';
import { Member } from 'src/entities/member.entity';
import { CreateLetterRequest } from './dto/create-letter.dto';
import { DataSource, Repository } from 'typeorm';
import { CommonResponse } from 'src/common/dto/output.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Hotel } from 'src/entities/hotel.entity';
import { LocalDate } from '@js-joda/core';
import { HotelWindow } from 'src/entities/hotel-window.entity';
import { Letter } from 'src/entities/letter.entity';
import { Reply } from 'src/entities/reply.entity';
import { MemberBlockHistory } from 'src/entities/member-block-history.entity';

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
    private readonly dataSource: DataSource
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
        .innerJoinAndSelect('hotel.member', 'member')
        .where('hotel.id = :hotelId and member.isActive = true', { hotelId: hotelId })
        .getOne();

      if (!hotel) {
        throw new BadRequestException(`존재하지 않는 호텔 정보입니다. : ${hotelId}`);
      }

      // 내가 편지 보내려는 사용자가 나를 차단한 경우
      const memberBlock = await this.memberBlockHistoryRepository
        .createQueryBuilder('memberBlock')
        .where(
          'memberBlock.fromMember.id = :fromMemberId and memberBlock.toMember.id = :toMemberId',
          { fromMemberId: hotel.member.id, toMemberId: loginMember.id }
        )
        .getOne();
      
      if (memberBlock) {
        throw new BadRequestException('호텔 주인에 의해 차단된 사용자입니다.');
      }

      // 2. 자신의 호텔인지 확인 (자기 호텔에는 편지를 쓰지 못함)
      if (hotel.member.id === loginMember.id) {
        throw new BadRequestException("자신의 호텔에는 편지를 쓸 수 없습니다.");
      }

      // 3. 이미지 파일 존재 여부 확인 (member의 멤버쉽 체크)
      if (image && !loginMember.getMembershipInfo().isPossibleAttachImage) {
        throw new BadRequestException("이미지 첨부를 할 수 없는 멤버쉽 정보입니다.");
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
          hasCookie: false
        }));
      }

      // 6. 받는 사람이 수신 편지 개수 제한이 있는지 확인
      const recievedLetterCount = await this.getRecievedLetterCount(hotelWindow);

      if (hotel.member.getMembershipInfo().hasLetterLimit) {
        this.checkMaximumReceivedLetterCount(recievedLetterCount);
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

      // 8. 편지를 받는 사람이 받아야 하는 편지수를 채운 경우 창문 OPEN
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
   * 편지 수신자의 창문의 개폐 여부를 판단하는 메서드
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
   * 편지 삭제 메서드
   */
  async deleteLetter(letterId: number, loginMember: Member): Promise<CommonResponse> {
    
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {

      // 1. 존재하는 편지인지 확인
      const letter = await this.letterRepository
        .createQueryBuilder('letter')
        .innerJoinAndSelect('letter.hotelWindow', 'hotelWindow')
        .innerJoinAndSelect('hotelWindow.hotel', 'hotel')
        .innerJoinAndSelect('hotel.member', 'member')
        .where('letter.id = :letterId and letter.isDeleted = false', { letterId: letterId })
        .getOne();

      if (!letter) {
        throw new BadRequestException(`존재하지 않는 편지 정보입니다. : ${letterId}`);
      }

      // 2. 편지 받은 사람과 삭제 요청한 사람과 동일한지 확인
      if (letter.hotelWindow.hotel.member.id !== loginMember.id) {
        throw new BadRequestException('자신이 받은 편지만 삭제할 수 있습니다.');
      }

      // 3. 해당 편지와 관련된 답장들을 모두 삭제 처리
      await queryRunner.query(`UPDATE reply SET is_deleted = true WHERE letter_id = ${letterId}`);
      
      // 4. 해당 편지도 삭제
      await queryRunner.query(`UPDATE letter SET is_deleted = true WHERE id = ${letterId}`);

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
   * 편지 차단 메서드
   */
  async blockLetter(letterId: number, loginMember: Member) {
    
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // 1. 존재하는 편지인지 확인
      const letter = await this.letterRepository
        .createQueryBuilder('letter')
        .innerJoinAndSelect('letter.sender', 'sender')
        .innerJoinAndSelect('letter.hotelWindow', 'hotelWindow')
        .innerJoinAndSelect('hotelWindow.hotel', 'hotel')
        .innerJoinAndSelect('hotel.member', 'member')
        .where('letter.id = :letterId and letter.isDeleted = false', { letterId: letterId })
        .getOne();

      if (!letter) {
        throw new BadRequestException('존재하지 않는 편지 정보입니다.');
      }

      // 2. 편지를 받은 사람과 로그인한 사용자와 같은지 확인 (자신이 받은 편지만 차단이 가능)
      if (letter.hotelWindow.hotel.member.id !== loginMember.id) {
        throw new BadRequestException('내가 받은 편지만 차단할 수 있습니다.');
      }

      // 3. 이미 차단 되어 있는 편지인지 확인
      if (letter.isBlocked) {
        throw new BadRequestException('이미 차단된 편지입니다.')
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
      const memberBlockHistory = await this.memberBlockHistoryRepository
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
   * 편지 차단 해제
   */
  async unblockLetter(letterId: number, loginMember: Member) {

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // 1. 존재하는 편지인지 확인
      const letter = await this.letterRepository
        .createQueryBuilder('letter')
        .innerJoinAndSelect('letter.sender', 'sender')
        .innerJoinAndSelect('letter.hotelWindow', 'hotelWindow')
        .innerJoinAndSelect('hotelWindow.hotel', 'hotel')
        .innerJoinAndSelect('hotel.member', 'member')
        .where('letter.id = :letterId and letter.isDeleted = false', { letterId: letterId })
        .getOne();

      if (!letter) {
        throw new BadRequestException('존재하지 않는 편지 정보입니다.');
      }

      // 2. 편지를 받은 사람과 로그인한 사용자와 같은지 확인 (자신이 받은 편지만 차단 해제 가능)
      if (letter.hotelWindow.hotel.member.id !== loginMember.id) {
        throw new BadRequestException('내가 받은 편지만 차단 해제할 수 있습니다.');
      }

      // 3. 차단 되어 있지 않는 편지인지 확인
      if (!letter.isBlocked) {
        throw new BadRequestException('차단 되어 있지 않은 편지입니다.')
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
      const memberBlockHistory = await this.memberBlockHistoryRepository
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
