import { BadRequestException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Vendor } from 'src/entities/domain/vendor.type';
import { DataSource, Repository } from 'typeorm';
import { SocialLoginResponse } from './dto/social-login.dto';
import { User } from 'src/entities/user.entity';
import { MembershipType } from 'src/entities/domain/membership.type';
import { Response } from 'express';
import { CreateHotelRequest, CreateHotelResponse } from './dto/create-hotel.dto';
import { Hotel } from 'src/entities/hotel.entity';

@Injectable()
export class AuthService {

  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    @InjectRepository(Hotel) private readonly hotelRepository: Repository<Hotel>,
    private readonly jwtService: JwtService,
    private readonly dataSource: DataSource
  ) { }

  private log = new Logger('AuthService');

  async socialLogin(email: string, socialId: string, vendor: Vendor, response: Response): Promise<SocialLoginResponse> {

    try {

      const existingUser: User = await this.userRepository.findOne({ where: { socialId: socialId, vendor: vendor } });

      if (existingUser) {
        
        if (!existingUser.isActive) {
          return {
            success: false,
            error: '탈퇴한 사용자 정보입니다.'
          }
        }

        const tokenPayload = { userId: existingUser.id };

        if (!existingUser.hasHotel) {
          // TODO: 나중에 로직 변경 (이건 호텔 생성 페이지로 리다이렉트를 해야할지? 의논 후 결정)

          response.status(HttpStatus.OK);

          return {
            success: false,
            error: `유저의 호텔이 존재하지 않습니다. 호텔 생성을 완료해주세요. : ${existingUser.id}`,
            accessToken: this.jwtService.sign(tokenPayload)
          };
        }

        response.status(HttpStatus.CREATED);

        return {
          success: true,
          accessToken: this.jwtService.sign(tokenPayload)
        }
      }

      const code: string = await this.generateUserCode(7);

      const user = await this.userRepository.save(this.userRepository.create({
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
        this.log.error(`사용자 code null : ${user.id}`);
      }

      const tokenPayload = { userId: user.id };

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

  private async generateUserCode(length: number): Promise<string> {
    const characters: string = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz1234567890';
    let isUnique: boolean = false;
    let uniqueCode: string = '';
    let limitCount = 0;

    /* 겹치는 코드가 나오지 않을 때 까지 동작 => 최대 10번까지만 확인하고, 넘어서면 null 반환 (StackOverFlow 피하고 추후에 처리할 수 있도록) */
    while (!isUnique) {
      for (let i = 0; i < length; i++) {
        uniqueCode += characters.charAt(Math.floor(Math.random() * characters.length));
      }

      const userCountHavingGeneratedCode: number = await this.userRepository.count({ where: { code: uniqueCode } });

      if (userCountHavingGeneratedCode === 0) {
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

  async createHotel(user: User, dto: CreateHotelRequest): Promise<CreateHotelResponse> {

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction(); // Transaction 시작

    try {
      if (user.hasHotel) {
        throw new BadRequestException(`이미 호텔을 소유하고 있는 사용자입니다. ${user.id}`);
      }
      user.hasHotel = true;

      if (dto.birthDate) {
        user.birthDate = dto.birthDate;
      }

      if (dto.gender) {
        user.gender = dto.gender;
      }

      if (dto.code) {
        const recommendedUser = await this.userRepository.findOne({ where: { code: dto.code } });

        if (!recommendedUser) {
          throw new BadRequestException(`존재하지 않는 사용자 코드입니다. (입력한 코드: ${dto.code})`);
        }
        if (user.id === recommendedUser.id) {
          throw new BadRequestException('자기 자신은 추천할 수 없습니다.');
        }
        recommendedUser.keyCount++;
        await queryRunner.manager.save(recommendedUser);
      }

      const savedUser = await queryRunner.manager.save(user);
      const hotel = await queryRunner.manager.save(this.hotelRepository.create({
        nickname: dto.nickname,
        description: dto.description,
        headColor: dto.headColor,
        bodyColor: dto.bodyColor,
        user: savedUser
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
