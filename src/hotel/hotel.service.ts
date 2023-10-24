import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Hotel } from 'src/entities/hotel.entity';
import { Member } from 'src/entities/member.entity';
import { Repository } from 'typeorm';
import { HotelDetailResponse } from './dto/hotel-detail.dto';
import { Letter } from 'src/entities/letter.entity';
import { Reply } from 'src/entities/reply.entity';
import { HotelWindow } from 'src/entities/hotel-window.entity';
import { LocalDate } from '@js-joda/core';
import { Village } from 'src/entities/village.entity';
import { HotelUpdateRequest } from './dto/hotel-update.dto';

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
    private readonly villageRepository: Repository<Village>
  ) {}

  /**
   * 메인 호텔 페이지 정보 조회
   */
  async getHotel(hotelId: number, loginMember: Member): Promise<HotelDetailResponse> {
    try {
      // 1. 존재하는 호텔 식별자인지 확인
      const hotel = await this.hotelRepository
        .createQueryBuilder('hotel')
        .innerJoinAndSelect('hotel.member', 'member')
        .where('hotel.id = :hotelId and member.isActive = true', { hotelId: hotelId })
        .getOne();

      if (!hotel) {
        throw new BadRequestException('존재하지 않는 호텔 정보입니다.');
      }

      // 2. 응답 데이터에 필요한 값들 설정 (오늘 받은 편지 수, 로그인 여부, 호텔 주인 여부, 친구 여부)
      const todayReceivedLetterCount: number = await this.getTodayReceivedLetterCount(hotel);
      let isLoginMember: boolean = false;
      let isOwner: boolean = false;
      let isFriend: boolean = false;

      if (loginMember) {
        isLoginMember = true;

        if (hotel.member.id === loginMember.id) {
          isOwner = true;
        }

        const village: Village = await this.villageRepository
        .createQueryBuilder('village')
        .where('village.fromMember.id = :fromMemberId and village.toHotel.id = :toHotelId', { fromMemberId: loginMember.id, toHotelId: hotel.id })
        .getOne();
      
        if (village) {
          isFriend = true;
        }
      }

      return {
        success: true,
        todayReceivedLetterCount: todayReceivedLetterCount,
        hotel: {
          headColor: hotel.headColor,
          bodyColor: hotel.bodyColor
        },
        isLoginMember: isLoginMember,
        isOwner: isOwner,
        isFriend: isFriend
      }

    } catch (e) {
      return {
        success: false,
        error: e.message
      }
    }
  }

  private async getTodayReceivedLetterCount(hotel: Hotel): Promise<number> {
    const today: LocalDate = LocalDate.now();
    const hotelWindow: HotelWindow = await this.hotelWindowRepository
      .createQueryBuilder('hotelWindow')
      .where('hotelWindow.date = :today and hotelWindow.hotel.id = :hotelId', { today: today, hotelId: hotel.id })
      .getOne();
    
    if (!hotelWindow) {
      return 0;
    }

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
   * 호텔 수정 메서드
   */
  async updateHotel(hotelId: number, dto: HotelUpdateRequest, loginMember: Member) {
    try {
      // 1. 로그인한 사용자의 호텔 정보를 조회
      const hotel = await this.hotelRepository
       .createQueryBuilder('hotel')
       .innerJoin('hotel.member', 'member', 'member.id = :memberId and member.isActive = true', { memberId: loginMember.id })
       .select(['hotel', 'member.id'])
       .getOne();

      if (!hotel) {
        throw new BadRequestException('존재하지 않는 호텔 정보입니다. 호텔 생성을 완료 후 이용해주세요.');
      }

      // 2. 수정 요청된 호텔과 로그인한 사용자의 호텔이 동일한지 확인
      if (hotel.id !== hotelId) {
        throw new BadRequestException('자신의 호텔 정보만 수정이 가능합니다.');
      }

      // 3. 호텔 수정 (무조건 hotel에 대한 select 쿼리가 발생되고, 수정 사항이 없으면 update 쿼리는 안 나감)
      const updatedHotel: Hotel = await this.hotelRepository.save(dto.getUpdatedHotel(hotel));

      return {
        success: true,
        hotelId: updatedHotel.id
      }

    } catch (e) {
      return {
        success: false,
        error: e.message
      }
    }
  }
}
