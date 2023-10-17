import { Body, Controller, Get, Post, Res, UseGuards } from '@nestjs/common';
import { AppleSocialRequest, GoogleSocialRequest, KakaoSocialRequest, NaverSocialRequest } from './dto/social-login.dto';
import { AuthService } from './auth.service';
import { Vendor } from 'src/entities/domain/vendor.type';
import { AuthGuard } from '@nestjs/passport';
import { Member } from 'src/entities/member.entity';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { LoginMember } from './decorator/login-member.decorator';
import { Response } from 'express';
import { CreateHotelRequest } from './dto/create-hotel.dto';
import { CommonResponse } from 'src/common/dto/output.dto';
import { CreateHotelValidationPipe } from './pipes/create-hotel.validation.pipe';
import { CreateHotelAPI, SocialLoginAPI } from 'src/common/swagger/decorator/auth-api.decorator';

@Controller('auth')
@ApiTags('Auth API')
export class AuthController {

  constructor(
    private readonly authService: AuthService
  ) {}

  @Post('/kakao')
  @SocialLoginAPI(Vendor.KAKAO, KakaoSocialRequest)
  async kakaoSocialLogin(@Body() dto: KakaoSocialRequest, @Res() response: Response) {
    response.json(await this.authService.socialLogin(dto.email, dto.id, Vendor.KAKAO, response));
  }

  @Post('/google')
  @SocialLoginAPI(Vendor.GOOGLE, GoogleSocialRequest)
  async googleSocialLogin(@Body() dto: GoogleSocialRequest, @Res() response: Response) {
    response.json(await this.authService.socialLogin(dto.email, dto.sub, Vendor.GOOGLE, response));
  }

  @Post('/naver')
  @SocialLoginAPI(Vendor.NAVER, NaverSocialRequest)
  async naverSocialLogin(@Body() dto: NaverSocialRequest, @Res() response: Response) {
    response.json(await this.authService.socialLogin(dto.email, dto.id, Vendor.NAVER, response));
  }

  @Post('/apple')
  @SocialLoginAPI(Vendor.APPLE, AppleSocialRequest)
  async appleSocialLogin(@Body() dto: AppleSocialRequest, @Res() response: Response) {
    response.json(await this.authService.socialLogin(dto.email, dto.sub, Vendor.APPLE, response));
  }

  @Post('/hotel')
  @CreateHotelAPI()
  @UseGuards(AuthGuard())
  createHotel(@LoginMember() member: Member, @Body(CreateHotelValidationPipe) dto: CreateHotelRequest): Promise<CommonResponse> {
    return this.authService.createHotel(member, dto);
  }

  /**
   * LoginMember 데코레이터 테스트 핸들러 method (추후에 지울 예정)
   */
  @Get('/member')
  @UseGuards(AuthGuard())
  @ApiBearerAuth('accessToken')
  @ApiOperation({ description: '테스트하기 위해 만든 API (삭제 예정)', deprecated: true })
  getMemberInfomationForTest(@LoginMember() member: Member) {
    console.log(member);
  }

}
