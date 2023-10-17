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
        .where('hotel.id = :hotelId', { hotelId: hotelId })
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
        .where('village.fromMember.id = :fromMemberId and village.toMember.id = :toMemberId', { fromMemberId: loginMember.id, toMemberId: hotel.member.id })
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
}
