import { Body, Controller, Post } from '@nestjs/common';
import { AppleSocialRequest, GoogleSocialRequest, KakaoSocialRequest, NaverSocialRequest, SocialLoginResponse } from './dto/social-login.dto';
import { AuthService } from './auth.service';
import { Vendor } from 'src/entities/domain/vendor.type';

@Controller('auth')
export class AuthController {

  constructor(
    private readonly authService: AuthService
  ) {}

  @Post('/kakao')
  kakaoSocialLogin(@Body() dto: KakaoSocialRequest): Promise<SocialLoginResponse> {
    return this.authService.socialLogin(dto.email, dto.id, Vendor.KAKAO);
  }

  @Post('/google')
  googleSocialLogin(@Body() dto: GoogleSocialRequest): Promise<SocialLoginResponse> {
    return this.authService.socialLogin(dto.email, dto.sub, Vendor.GOOGLE);
  }

  @Post('/naver')
  naverSocialLogin(@Body() dto: NaverSocialRequest): Promise<SocialLoginResponse> {
    return this.authService.socialLogin(dto.email, dto.id, Vendor.NAVER);
  }

  @Post('/apple')
  appleSocialLogin(@Body() dto: AppleSocialRequest): Promise<SocialLoginResponse> {
    return this.authService.socialLogin(dto.email, dto.sub, Vendor.APPLE);
  }

}
