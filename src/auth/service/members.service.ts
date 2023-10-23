import { BadRequestException, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Hotel } from "src/entities/hotel.entity";
import { Member } from "src/entities/member.entity";
import { Repository } from "typeorm";

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
}