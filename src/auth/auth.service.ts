import { Injectable, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Vendor } from 'src/entities/domain/vendor.type';
import { Repository } from 'typeorm';
import { SocialLoginResponse } from './dto/social-login.dto';
import { User } from 'src/entities/user.entity';
import { MembershipType } from 'src/entities/domain/membership.type';

@Injectable()
export class AuthService {

  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
  ) { }

  private log = new Logger('AuthService');

  async socialLogin(email: string, socialId: string, vendor: Vendor): Promise<SocialLoginResponse> {

    try {

      const existingUser: User = await this.userRepository.findOne({ where: { socialId: socialId, vendor: vendor } });

      if (existingUser) {
        
        if (!existingUser.isActive) {
          return {
            success: false,
            error: '비활성화된 사용자 정보입니다.'
          }
        }

        const tokenPayload = { id: existingUser.id };

        if (!existingUser.hasHotel) {
          // TODO: 나중에 로직 변경 (이건 호텔 생성 페이지로 리다이렉트를 해야할지? 의논 후 결정)
          return {
            success: false,
            error: `유저의 호텔이 존재하지 않습니다. 호텔 생성을 완료해주세요. : ${existingUser.id}`,
            accessToken: this.jwtService.sign(tokenPayload)
          }
        }

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
        email: email === undefined ? null : email,
        isActive: true,
        hasHotel: false, // 호텔 생성 페이지에서 호텔 생성 후 true로 변경
        code: code,
        feekCount: 0,
        keyCount: 0
      }));

      if (code === null) {
        this.log.error(`사용자 code null : ${user.id}`);
      }

      const tokenPayload = { id: user.id };

      return {
        success: true,
        accessToken: this.jwtService.sign(tokenPayload)
      }

    } catch (error) {
      console.log(error);
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

}
