import { BadRequestException, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Hotel } from "src/entities/hotel.entity";
import { Member } from "src/entities/member.entity";
import { DataSource, Repository } from "typeorm";
import { UpdateMemberRequest } from "../dto/update-member.dto";

@Injectable()
export class MemberService {
  constructor(
    @InjectRepository(Member)
    private readonly memberRepository: Repository<Member>,
    @InjectRepository(Hotel)
    private readonly hotelRepository: Repository<Hotel>,
    private readonly dataSource: DataSource
  ) {}

  async getMemberInfo(loginMember: Member) {
    try {
      const hotel: Hotel = await this.hotelRepository
        .createQueryBuilder('hotel')
        .innerJoin('hotel.member', 'member', 'member.id = :memberId and member.isActive = true', { memberId: loginMember.id })
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

    } catch (error) {
      throw error;
    }
  }

  /**
   * 사용자 정보 수정
   */
  async updateMemberInfo(dto: UpdateMemberRequest, loginMember: Member) {
    try {
      // 1. 성별 정보가 이미 있는 경우
      if (dto.getGener() && loginMember.gender) {
        throw new BadRequestException('성별은 한번 설정하면 변경이 불가능합니다.');
      }

      // 2. 생년월일 정보가 이미 있는 경우
      if (dto.getBirthDaate() && loginMember.birthDate) {
        throw new BadRequestException('생년월일은 한번 설정하면 변경이 불가능합니다.');
      }
      
      // 3. 사용자의 성별, 생년월일을 수정 (존재한다면)
      const updatedMember: Member = await this.memberRepository.save(dto.getUpdatedMember(loginMember));

      return {
        success: true,
        memberId: updatedMember.id
      }

    } catch (error) {
      throw error;
    }
  }

  /**
   * 회원 탈퇴
   */
  async deleteMember(loginMember: Member) {

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {

      const hotel: Hotel = await this.hotelRepository
        .createQueryBuilder('hotel')
        .select('hotel.id')
        .where('hotel.member.id = :memberId', { memberId: loginMember.id })
        .getOne();

      // 1. 나를 빌리지에 추가한 사람, 내가 빌리지에 추가한 사람 모두 삭제
      queryRunner.manager.query(
        `DELETE FROM village WHERE from_member_id = ${loginMember.id} OR to_hotel_id = ${hotel.id}`
      );

      // 2. 나를 차단한 사람, 내가 차단한 사람 모두 삭제
      queryRunner.manager.query(
        `DELETE FROM member_block_history WHERE from_member_id = ${loginMember.id} OR to_member_id = ${loginMember.id}`
      );

      // 3. 사용자 탈퇴 처리
      loginMember.isActive = false;
      await queryRunner.manager.save(loginMember);

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