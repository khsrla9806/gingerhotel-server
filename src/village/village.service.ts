import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CommonResponse } from 'src/common/dto/output.dto';
import { Hotel } from 'src/entities/hotel.entity';
import { Member } from 'src/entities/member.entity';
import { Village } from 'src/entities/village.entity';
import { Repository } from 'typeorm';

@Injectable()
export class VillageService {
  constructor(
    @InjectRepository(Village)
    private readonly villageRepository: Repository<Village>,
    @InjectRepository(Hotel)
    private readonly hotelRepository: Repository<Hotel>
  ) {}

  /**
   * 빌리지에 추가
   */
  async createVillage(hotelId: number, loginMember: Member): Promise<CommonResponse> {
    try {
      const hotel: Hotel = await this.hotelRepository
        .createQueryBuilder('hotel')
        .innerJoinAndSelect('hotel.member', 'member')
        .where('hotel.id = :hotelId and member.isActive = true', { hotelId: hotelId })
        .getOne();
  
      if (!hotel) {
        throw new BadRequestException('존재하지 않는 호텔 정보입니다.');
      }

      if (hotel.member.id === loginMember.id) {
        throw new BadRequestException('자기 자신은 빌리지에 추가할 수 없습니다.');
      }

      const village: Village = await this.villageRepository
        .createQueryBuilder('village')
        .where('village.fromMember.id = :fromMemberId and village.toMember.id = :toMemberId', { fromMemberId: loginMember.id, toMemberId: hotel.member.id })
        .getOne();

      if (village) {
        throw new BadRequestException('이미 내 빌리지에 등록한 사용자입니다.');
      }

      await this.villageRepository.save(this.villageRepository.create({
        fromMember: loginMember,
        toMember: hotel.member,
        isBookmark: false
      }));

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
   * 빌리지에서 삭제
   */
  async deleteVillage(hotelId: number, loginMember: Member) {
    try {
      const hotel: Hotel = await this.hotelRepository
        .createQueryBuilder('hotel')
        .innerJoinAndSelect('hotel.member', 'member')
        .where('hotel.id = :hotelId and member.isActive = true', { hotelId: hotelId })
        .getOne();

      if (!hotel) {
        throw new BadRequestException('존재하지 않는 호텔 정보입니다.');
      }
      
      if (hotel.member.id === loginMember.id) {
        throw new BadRequestException('자기 자신을 빌리지에서 삭제할 수 없습니다.');
      }
      
      const village: Village = await this.villageRepository
        .createQueryBuilder('village')
        .where('village.fromMember.id = :fromMemberId and village.toMember.id = :toMemberId', { fromMemberId: loginMember.id, toMemberId: hotel.member.id })
        .getOne();

      if (!village) {
        throw new BadRequestException('내 빌리지에 등록되어 있지 않은 사용자입니다.');
      }

      await this.villageRepository.delete(village.id);

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
}
