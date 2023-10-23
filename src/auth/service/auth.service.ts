import { BadRequestException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Vendor } from 'src/entities/domain/vendor.type';
import { DataSource, Repository } from 'typeorm';
import { SocialLoginResponse } from '../dto/social-login.dto';
import { Member } from 'src/entities/member.entity';
import { MembershipType } from 'src/entities/domain/membership.type';
import { Response } from 'express';
import { CreateHotelRequest, CreateHotelResponse } from '../dto/create-hotel.dto';
import { Hotel } from 'src/entities/hotel.entity';

@Injectable()
export class AuthService {

  constructor(
    @InjectRepository(Member) private readonly memberRepository: Repository<Member>,
    @InjectRepository(Hotel) private readonly hotelRepository: Repository<Hotel>,
    private readonly jwtService: JwtService,
    private readonly dataSource: DataSource
  ) { }

  private log = new Logger('AuthService');

  async socialLogin(email: string, socialId: string, vendor: Vendor, response: Response): Promise<SocialLoginResponse> {

    try {

      const existingMember: Member = await this.memberRepository.findOne({ where: { socialId: socialId, vendor: vendor } });

      if (existingMember) {
        
        if (!existingMember.isActive) {
          return {
            success: false,
            error: '탈퇴한 사용자 정보입니다.'
          }
        }

        const tokenPayload = { memberId: existingMember.id };

        if (!existingMember.hasHotel) {
          // TODO: 나중에 로직 변경 (이건 호텔 생성 페이지로 리다이렉트를 해야할지? 의논 후 결정)

          response.status(HttpStatus.OK);

          return {
            success: false,
            error: `유저의 호텔이 존재하지 않습니다. 호텔 생성을 완료해주세요. : ${existingMember.id}`,
            accessToken: this.jwtService.sign(tokenPayload)
          };
        }

        response.status(HttpStatus.CREATED);

        return {
          success: true,
          accessToken: this.jwtService.sign(tokenPayload)
        }
      }

      const code: string = await this.generateMemberCode(7);

      const member = await this.memberRepository.save(this.memberRepository.create({
        membership: MembershipType.FREE,
        socialId: socialId,
        vendor: vendor,
        email: email,
        isActive: true,
        hasHotel: false, // 호텔 생성 페이지에서 호텔 생성 후 true로 변경
        code: code,
        feekCount: 0,
        keyCount: 0
      }));

      if (code === null) {
        this.log.error(`사용자 code null : ${member.id}`);
      }

      const tokenPayload = { memberId: member.id };

      return {
        success: true,
        accessToken: this.jwtService.sign(tokenPayload)
      }

    } catch (error) {
      this.log.error('error: ', error);

      response.status(HttpStatus.BAD_REQUEST);

      return {
        success: false,
        error: error.message
      }
    }
  }

  private async generateMemberCode(length: number): Promise<string> {
    const characters: string = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz1234567890';
    let isUnique: boolean = false;
    let uniqueCode: string = '';
    let limitCount = 0;

    /* 겹치는 코드가 나오지 않을 때 까지 동작 => 최대 10번까지만 확인하고, 넘어서면 null 반환 (StackOverFlow 피하고 추후에 처리할 수 있도록) */
    while (!isUnique) {
      for (let i = 0; i < length; i++) {
        uniqueCode += characters.charAt(Math.floor(Math.random() * characters.length));
      }

      const memberCountHavingGeneratedCode: number = await this.memberRepository.count({ where: { code: uniqueCode } });

      if (memberCountHavingGeneratedCode === 0) {
        return uniqueCode;
      }

      if (limitCount >= 10) {
        break;
      }

      uniqueCode = '';
      limitCount++;
    }

    return null;
  }

  async createHotel(member: Member, dto: CreateHotelRequest): Promise<CreateHotelResponse> {

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction(); // Transaction 시작

    try {
      console.log(member)
      if (member.hasHotel) {
        throw new BadRequestException(`이미 호텔을 소유하고 있는 사용자입니다. ${member.id}`);
      }
      member.hasHotel = true;

      if (dto.birthDate) {
        member.birthDate = dto.birthDate;
      }

      if (dto.gender) {
        member.gender = dto.gender;
      }

      if (dto.code) {
        const recommendedMember = await this.memberRepository.findOne({ where: { code: dto.code } });

        if (!recommendedMember) {
          throw new BadRequestException(`존재하지 않는 사용자 코드입니다. (입력한 코드: ${dto.code})`);
        }
        if (member.id === recommendedMember.id) {
          throw new BadRequestException('자기 자신은 추천할 수 없습니다.');
        }
        recommendedMember.keyCount++;
        await queryRunner.manager.save(recommendedMember);
      }

      const savedMember = await queryRunner.manager.save(member);
      const hotel = await queryRunner.manager.save(this.hotelRepository.create({
        nickname: dto.nickname,
        description: dto.description,
        headColor: dto.headColor,
        bodyColor: dto.bodyColor,
        member: savedMember
      }));

      await queryRunner.commitTransaction(); // Transaction Commit (DB 반영)

      return {
        success: true,
        hotelId: hotel.id
      }

    } catch (exception) {
      this.log.error('exception', exception);
      await queryRunner.rollbackTransaction(); // 하나라도 실패 시 Transaction Rollback (원자성 보장)

      return {
        success: false,
        error: exception.message
      }
    } finally {
      await queryRunner.release(); // Transaction 반납 (다른 사용자들이 사용할 수 있도록)
    }
  }

}
