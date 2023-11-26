import { BadRequestException, Body, Controller, Get, Post, Query, Res, UseGuards } from '@nestjs/common';
import { AppleSocialRequest, GoogleSocialRequest, KakaoSocialRequest, NaverSocialRequest } from '../dto/social-login.dto';
import { AuthService } from '../service/auth.service';
import { Vendor } from 'src/entities/domain/vendor.type';
import { AuthGuard } from '@nestjs/passport';
import { Member } from 'src/entities/member.entity';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { LoginMember } from '../decorator/login-member.decorator';
import { Response, response } from 'express';
import { CreateHotelRequest } from '../dto/create-hotel.dto';
import { CommonResponse } from 'src/common/dto/output.dto';
import { CreateHotelValidationPipe } from '../pipes/create-hotel.validation.pipe';
import { CheckMemberByCodeAPI, CreateHotelAPI, SocialLoginAPI } from 'src/common/swagger/decorator/auth-api.decorator';
import { OAuth2Client } from 'google-auth-library';
import { MemberCodeValidationPipe } from '../pipes/member-code.validation.pipe';

import * as jwt from "jsonwebtoken";
import verifyAppleToken from "verify-apple-id-token";
import { ErrorCode } from 'src/common/filter/code/error-code.enum';

const googleClient = new OAuth2Client(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
);

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
  async googleSocialLogin(@Body() dto:GoogleSocialRequest, @Res() response: Response) {

    response.json(await this.authService.socialLogin(dto.email, dto.sub, Vendor.GOOGLE, response));
  }

  @Post('/naver')
  @SocialLoginAPI(Vendor.NAVER, NaverSocialRequest)
  async naverSocialLogin(@Body() dto: NaverSocialRequest, @Res() response: Response) {
    response.json(await this.authService.socialLogin(dto.email, dto.id, Vendor.NAVER, response));
  }

  @Post('/apple')
  @SocialLoginAPI(Vendor.APPLE, AppleSocialRequest)
  async appleSocialLogin(@Body('token') token, @Res() response: Response) {
    // Todo: Need to validation apple auth.
    const appleData = jwt.decode(token);
    /* Need to find out how to handle the client ID.
    // client id 
    const jwtClaims = await verifyAppleToken({ 
      idToken: token,
      clientId: "com.teamginger.gingerhoteltest", // or ["app1ClientId", "app2ClientId"]
      nonce: "nonce", // optional
    });*/
    
    response.json(await this.authService.socialLogin(appleData["email"], appleData["sub"].toString(), Vendor.APPLE, response));
  }

  @Post('/hotel')
  @CreateHotelAPI()
  @UseGuards(AuthGuard())
  createHotel(@LoginMember() member: Member, @Body(CreateHotelValidationPipe) dto: CreateHotelRequest): Promise<CommonResponse> {
    return this.authService.createHotel(member, dto);
  }

  @Get('/member')
  @CheckMemberByCodeAPI()
  @UseGuards(AuthGuard())
  async checkMemberByCode(@LoginMember() loginMember: Member, @Query('code', MemberCodeValidationPipe) code: string) {
    return await this.authService.checkMemeberByCode(loginMember, code);
  }

  @Post('/test')
  @ApiOperation({description: '임시 소셜 로그인 API', deprecated: true })
  async testSocialLogin(
    @Body() { socialId, vendor },
    @Res() response: Response
  ) {
    let socialVendor: Vendor = null;

    if (vendor === 'GOOGLE') {
      socialVendor = Vendor.GOOGLE;
    } else if (vendor === 'APPLE') {
      socialVendor = Vendor.APPLE;
    } else if (vendor === 'NAVER') {
      socialVendor = Vendor.NAVER;
    } else if (vendor === 'KAKAO') {
      socialVendor = Vendor.KAKAO;
    } else {
      throw new BadRequestException('vendor는 GOOGLE, APPLE, NAVER, KAKAO 중에서 한 개를 입력해야 합니다.', ErrorCode.ValidationFailed);
    }

    response.json(await this.authService.socialLogin(null, socialId, socialVendor, response));
  }
}
