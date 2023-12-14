import { BadRequestException, ForbiddenException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Hotel } from 'src/entities/hotel.entity';
import { Member } from 'src/entities/member.entity';
import { DataSource, Repository } from 'typeorm';
import { HotelDetailResponse, HotelWindowInfo } from '../dto/hotel-detail.dto';
import { Letter } from 'src/entities/letter.entity';
import { Reply } from 'src/entities/reply.entity';
import { HotelWindow } from 'src/entities/hotel-window.entity';
import { LocalDate } from '@js-joda/core';
import { Village } from 'src/entities/village.entity';
import { HotelUpdateRequest } from '../dto/hotel-update.dto';
import { MemberBlockHistory } from 'src/entities/member-block-history.entity';
import { LetterLimit } from 'src/entities/domain/letter-limit.type';
import { ErrorCode } from 'src/common/filter/code/error-code.enum';
import { localDateTimeUtils } from 'src/common/utils/local-date-time.utils';

@Injectable()
export class HotelService {
  constructor(
    @InjectRepository(Hotel)
    private readonly hotelRepository: Repository<Hotel>,
    @InjectRepository(Letter)
    private readonly letterRepository: Repository<Letter>,
    @InjectRepository(Reply)
    private readonly replyRepository: Repository<Reply>,
    @InjectRepository(HotelWindow)
    private readonly hotelWindowRepository: Repository<HotelWindow>,
    @InjectRepository(Village)
    private readonly villageRepository: Repository<Village>,
    @InjectRepository(MemberBlockHistory)
    private readonly memberBlockRepository: Repository<MemberBlockHistory>,
    private readonly dateSource: DataSource
  ) {}

  /**
   * 메인 호텔 페이지 정보 조회
   */
  async getHotel(hotelId: number, loginMember: Member): Promise<HotelDetailResponse> {
    try {
      // 존재하는 호텔 식별자인지 확인
      const hotel: Hotel = await this.hotelRepository
        .createQueryBuilder('hotel')
        .innerJoin('hotel.member', 'member')
        .select(['hotel', 'member.id', 'member.membership', 'member.feekCount', 'member.keyCount'])
        .where('hotel.id = :hotelId and member.isActive = true', { hotelId: hotelId })
        .getOne();

      if (!hotel) {
        throw new BadRequestException('존재하지 않는 호텔 정보입니다.', ErrorCode.NotFoundResource);
      }

      // 해당 호텔에 관련된 창문의 정보를 모두 가져옴
      const hotelWindows: HotelWindow[] = await this.hotelWindowRepository
        .createQueryBuilder('hotelWindow')
        .select(['hotelWindow.id', 'hotelWindow.date', 'hotelWindow.isOpen', 'hotelWindow.hasCookie', 'hotelWindow.hasLimit'])
        .innerJoin('hotelWindow.hotel', 'hotel', 'hotel.id = :hotelId', { hotelId: hotel.id })
        .getMany();

      if (localDateTimeUtils.isTargetDate()) {
        hotelWindows.map(window => window.isOpen = true);
      }
      
      // 오늘 날짜에 해당하는 창문이 있는지 확인
      const todayWindow: HotelWindow = this.getTodayWindow(hotelWindows);

      // 응답 데이터에 필요한 값들 설정 (오늘 받은 편지 수, 로그인 여부, 호텔 주인 여부, 친구 여부)
      const todayReceivedLetterCount: number = await this.getTodayReceivedLetterCount(todayWindow);
      let canReceiveLetterToday: boolean = this.getCanReceiveLetterToday(hotel.member, todayWindow, todayReceivedLetterCount);
      let isLoginMember: boolean = false;
      let isOwner: boolean = false;
      let isFriend: boolean = false;
      let isBlocked: boolean = false;

      if (loginMember) {
        if (loginMember.hasHotel) {
          isLoginMember = true; // AccessToken이 있는데, 호텔이 없으면 로그인하지 않은 사용자로 판단
        }

        if (hotel.member.id === loginMember.id) {
          isOwner = true;
        } else {
          const village: Village = await this.villageRepository
            .createQueryBuilder('village')
            .where(
              'village.fromMember.id = :fromMemberId and village.toHotel.id = :toHotelId', 
              { fromMemberId: loginMember.id, toHotelId: hotel.id }
            )
            .getOne();
        
          if (village) {
            isFriend = true;
          }

          const blockHistory: MemberBlockHistory = await this.memberBlockRepository
            .createQueryBuilder('blockHistory')
            .where(
              'blockHistory.fromMember.id = :fromMemberId and blockHistory.toMember.id = :toMemberId',
              { fromMemberId: hotel.member.id, toMemberId: loginMember.id }
            )
            .getOne();

          if (blockHistory) {
            isBlocked = true;
          }
        }
      }

      return {
        success: true,
        canReceiveLetterToday: canReceiveLetterToday,
        todayReceivedLetterCount: todayReceivedLetterCount,
        feekCount: hotel.member.feekCount,
        keyCount: hotel.member.keyCount,
        hotel: {
          nickname: hotel.nickname,
          description: hotel.description,
          structColor: hotel.structColor,
          bodyColor: hotel.bodyColor,
          buildingDecorator: hotel.buildingDecorator,
          gardenDecorator: hotel.gardenDecorator,
          windowDecorator: hotel.windowDecorator,
          background: hotel.background
        },
        hotelWindows: this.convertHotelWindowsToJSON(hotelWindows),
        isLoginMember: isLoginMember,
        isOwner: isOwner,
        isFriend: isFriend,
        isBlocked: isBlocked
      }

    } catch (error) {
      throw error;
    }
  }

  private getTodayWindow(hotelWindows: HotelWindow[]): HotelWindow {
    if (hotelWindows) {
      for (let index: number = 0; index < hotelWindows.length; index++) {
        if (hotelWindows[index].date.equals(LocalDate.now())) {
          return hotelWindows[index];
        }
      }
    }

    return null;
  }

  private async getTodayReceivedLetterCount(todayWindow: HotelWindow): Promise<number> {
    if (!todayWindow) {
      return 0;
    }

    const letterCount: number = await this.letterRepository
      .createQueryBuilder('letter')
      .where('letter.hotelWindow.id = :hotelWindowId and letter.isDeleted = false', { hotelWindowId: todayWindow.id })
      .getCount();

    const replyCount: number = await this.replyRepository
      .createQueryBuilder('reply')
      .where('reply.hotelWindow.id = :hotelWindowId and reply.isDeleted = false', { hotelWindowId: todayWindow.id })
      .getCount();

    return letterCount + replyCount;
  }

  private getCanReceiveLetterToday(member: Member, todayHotelWindow: HotelWindow, todayRecivedLetterCount: number): boolean {
    // member의 멤버쉽 상태가 편지 제한이 없거나, 오늘 날짜에 해당하는 호텔 창문이 존재하지 않는 경우에는 무조건 추가 편지를 받을 수 있다.
    if (!member.getMembershipInfo().hasLetterLimit || !todayHotelWindow) {
      return true;
    }

    // 오늘 날짜의 호텔 창문에 제한이 있다면 최대 20개, 없다면 최대 100개까지 수신이 가능하다.
    let maxLetterCount: number = LetterLimit.limitCount;
    if (!todayHotelWindow.hasLimit) {
      maxLetterCount = LetterLimit.unlimitCount;
    }

    return todayRecivedLetterCount < maxLetterCount;
  }

  private convertHotelWindowsToJSON(hotelWindows: HotelWindow[]): object {
    const jsonObject: object = {};

    hotelWindows.forEach((hotelWindow) => {
      const hotelWindowInfo: HotelWindowInfo = {
        id: hotelWindow.id,
        isOpen: hotelWindow.isOpen,
        hasCookie: hotelWindow.hasCookie
      }
      jsonObject[hotelWindow.date.toString()] = hotelWindowInfo;
    });

    return jsonObject;
  }

  /**
   * 호텔 수정 메서드
   */
  async updateHotel(hotelId: number, dto: HotelUpdateRequest, loginMember: Member) {
    try {
      // 1. 로그인한 사용자의 호텔 정보를 조회
      const hotel: Hotel = await this.hotelRepository
        .createQueryBuilder('hotel')
        .innerJoin('hotel.member', 'member', 'member.id = :memberId and member.isActive = true', { memberId: loginMember.id })
        .select(['hotel', 'member.id'])
        .getOne();

      if (!hotel) {
        throw new BadRequestException('존재하지 않는 호텔 정보입니다. 호텔 생성을 완료 후 이용해주세요.', ErrorCode.NotFoundResource);
      }

      // 2. 수정 요청된 호텔과 로그인한 사용자의 호텔이 동일한지 확인
      if (hotel.id !== hotelId) {
        throw new BadRequestException('자신의 호텔 정보만 수정이 가능합니다.', ErrorCode.AccessDenied);
      }

      // 3. 호텔 수정 (무조건 hotel에 대한 select 쿼리가 발생되고, 수정 사항이 없으면 update 쿼리는 안 나감)
      const updatedHotel: Hotel = await this.hotelRepository.save(dto.getUpdatedHotel(hotel));

      return {
        success: true,
        hotelId: updatedHotel.id
      }

    } catch (error) {
      throw error;
    }
  }

  /**
   * 호텔 창문 열기 (열쇠 사용)
   */
  async openWindow(hotelId: number, date: LocalDate, loginMember: Member) {
    const queryRunner = this.dateSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    
    try {
      const hotelWindow: HotelWindow = await queryRunner.manager.getRepository(HotelWindow)
        .createQueryBuilder('hotelWindow')
        .innerJoin('hotelWindow.hotel', 'hotel', 'hotel.id = :hotelId', { hotelId: hotelId })
        .innerJoin('hotel.member', 'member')
        .select(['hotelWindow', 'hotel.id', 'member.id', 'member.keyCount'])
        .where('hotelWindow.date = :date', { date: date })
        .getOne();

      if (!hotelWindow) {
        throw new BadRequestException('존재하지 않는 창문입니다.', ErrorCode.NotFoundResource);
      }

      const hotelOwner: Member = hotelWindow.hotel.member;

      if (hotelOwner.id !== loginMember.id) {
        throw new ForbiddenException('내 호텔의 창문만 열 수 있습니다.', ErrorCode.AccessDenied);
      }

      if (hotelWindow.isOpen) {
        throw new BadRequestException('이미 열려있는 창문입니다.', ErrorCode.AlreadyWindowOpened);
      }

      if (hotelOwner.keyCount <= 0) {
        throw new BadRequestException('열쇠 개수가 부족합니다.', ErrorCode.InsufficientKeyCount);
      }

      await queryRunner.manager.query(
        `UPDATE hotel_window SET is_open = true, has_cookie = true WHERE id = ${hotelWindow.id}`
      );

      await queryRunner.manager.query(
        `UPDATE member SET key_count = ${hotelOwner.keyCount - 1} WHERE id = ${hotelOwner.id}`
      );

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
   * 오늘 창문(편지함)의 제한 수를 해제 (20개 -> 100개)
   */
  async unlimitWindow(hotelId: number, date: LocalDate, loginMember: Member) {
    
    try {
      const hotelWindow: HotelWindow = await this.hotelWindowRepository
        .createQueryBuilder('hotelWindow')
        .innerJoin('hotelWindow.hotel', 'hotel', 'hotel.id = :hotelId', { hotelId: hotelId })
        .innerJoin('hotel.member', 'member')
        .select(['hotelWindow', 'hotel.id', 'member.id'])
        .where('hotelWindow.date = :date', { date: date })
        .getOne();

      if (!hotelWindow) {
        throw new BadRequestException('존재하지 않는 창문입니다.', ErrorCode.NotFoundResource);
      }

      const hotelOwner: Member = hotelWindow.hotel.member;

      if (hotelOwner.id !== loginMember.id) {
        throw new ForbiddenException('내 호텔의 창문이 아닙니다.', ErrorCode.AccessDenied);
      }

      if (!hotelWindow.hasLimit) {
        throw new BadRequestException('오늘 편지 제한수를 이미 해제했습니다.', ErrorCode.AlreadyUnlimitLetterCount);
      }

      await this.hotelWindowRepository.manager.query(
        `UPDATE hotel_window SET has_limit = false WHERE id = ${hotelWindow.id}`
      );

      return {
        success: true
      }
    } catch (error) {
      
      throw error;
    }
  }
}
