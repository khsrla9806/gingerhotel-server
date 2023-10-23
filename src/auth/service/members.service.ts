import { BadRequestException, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Hotel } from "src/entities/hotel.entity";
import { Member } from "src/entities/member.entity";
import { Repository } from "typeorm";
import { UpdateMemberRequest } from "../dto/update-member.dto";

@Injectable()
export class MemberService {
  constructor(
    @InjectRepository(Member)
    private readonly memberRepository: Repository<Member>,
    @InjectRepository(Hotel)
    private readonly hotelRepository: Repository<Hotel>
  ) {}

  async getMemberInfo(memberId: number, loginMember: Member) {
    try {

      if (memberId !== loginMember.id) {
        throw new BadRequestException('자신의 정보만 요청이 가능합니다.')
      }

      const hotel = await this.hotelRepository
        .createQueryBuilder('hotel')
        .innerJoin('hotel.member', 'member', 'member.id = :memberId', { memberId: memberId })
        .getOne();

      if (!hotel) {
        throw new BadRequestException('사용자의 호텔이 존재하지 않습니다. 호텔 생성을 완료 후 이용해주세요.')
      }

      return {
        success: true,
        user: {
          nickname: hotel.nickname,
          code: loginMember.code,
          membership: loginMember.membership,
          gender: loginMember.gender,
          birthDate: loginMember.birthDate,
          keyCount: loginMember.keyCount,
          feekCount: loginMember.feekCount
        },
        hotel: {
          id: hotel.id,
          nickname: hotel.nickname,
          description: hotel.description,
          headColor: hotel.headColor,
          bodyColot: hotel.bodyColor
        }
      }

    } catch (e) {
      return {
        success: false,
        error: e.message
      }
    }
  }

  /**
   * 사용자 정보 수정
   */
  async updateMemberInfo(memberId: number, dto: UpdateMemberRequest, loginMember: Member) {
    try {
      // 1. 수정 요청된 사용자와 로그인한 사용자가 동일한지 확인
      if (memberId !== loginMember.id) {
        throw new BadRequestException('내 정보만 수정이 가능합니다.');
      }

      // 2. 성별 정보가 이미 있는 경우
      if (dto.getGener() && loginMember.gender) {
        throw new BadRequestException('성별은 한번 설정하면 변경이 불가능합니다.');
      }

      // 3. 생년월일 정보가 이미 있는 경우
      if (dto.getBirthDaate() && loginMember.birthDate) {
        throw new BadRequestException('생년월일은 한번 설정하면 변경이 불가능합니다.');
      }
      
      // 4. 사용자의 성별, 생년월일을 수정 (존재한다면)
      const updatedMember: Member = await this.memberRepository.save(dto.getUpdatedMember(loginMember));

      return {
        success: true,
        memberId: updatedMember.id
      }


    } catch (e) {
      return {
        success: false,
        error: e.message
      }
    }
  }
}