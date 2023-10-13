import { Body, Controller, Get, Post, Res, UseGuards } from '@nestjs/common';
import { AppleSocialRequest, GoogleSocialRequest, KakaoSocialRequest, NaverSocialRequest, SocialLoginResponse } from './dto/social-login.dto';
import { AuthService } from './auth.service';
import { Vendor } from 'src/entities/domain/vendor.type';
import { AuthGuard } from '@nestjs/passport';
import { User } from 'src/entities/user.entity';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { SocialLoginAPI } from 'src/common/swagger/decorator/social-api.decorator';
import { LoginUser } from './decorator/login-user.decorator';
import { Response } from 'express';

@Controller('auth')
@ApiTags('Auth API')
export class AuthController {

  constructor(
    private readonly authService: AuthService
  ) {}

  @Post('/kakao')
  @SocialLoginAPI(Vendor.KAKAO, KakaoSocialRequest)
  kakaoSocialLogin(@Body() dto: KakaoSocialRequest, @Res() response: Response): Promise<SocialLoginResponse> {
    return this.authService.socialLogin(dto.email, dto.id, Vendor.KAKAO, response);
  }

  @Post('/google')
  @SocialLoginAPI(Vendor.GOOGLE, GoogleSocialRequest)
  googleSocialLogin(@Body() dto: GoogleSocialRequest, @Res() response: Response): Promise<SocialLoginResponse> {
    return this.authService.socialLogin(dto.email, dto.sub, Vendor.GOOGLE, response);
  }

  @Post('/naver')
  @SocialLoginAPI(Vendor.NAVER, NaverSocialRequest)
  naverSocialLogin(@Body() dto: NaverSocialRequest, @Res() response: Response): Promise<SocialLoginResponse> {
    return this.authService.socialLogin(dto.email, dto.id, Vendor.NAVER, response);
  }

  @Post('/apple')
  @SocialLoginAPI(Vendor.APPLE, AppleSocialRequest)
  appleSocialLogin(@Body() dto: AppleSocialRequest, @Res() response: Response): Promise<SocialLoginResponse> {
    return this.authService.socialLogin(dto.email, dto.sub, Vendor.APPLE, response);
  }

  /**
   * LoginUser 데코레이터 테스트 핸들러 method (추후에 지울 예정)
   */
  @Get('/user')
  @UseGuards(AuthGuard())
  @ApiBearerAuth('accessToken')
  @ApiOperation({ description: '테스트하기 위해 만든 API (삭제 예정)', deprecated: true })
  getUserInfomationForTest(@LoginUser() user: User) {
    console.log(user);
  }

}
