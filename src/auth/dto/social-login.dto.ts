import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";
import { CommonResponse } from "src/common/dto/output.dto";

export class SocialLoginResponse extends CommonResponse {
    @ApiPropertyOptional({ description: '로그인한 사용자의 토큰 정보' })
    accessToken?: string;
}

export class KakaoSocialRequest {
    @ApiProperty({ description: '[필수 O] kakao 로그인 사용자의 식별값', required: true })
    @IsNotEmpty({ message: 'social id is required.' })
    id: string;

    @ApiPropertyOptional()
    name?: string;

    @ApiPropertyOptional()
    birthday?: string;

    @ApiPropertyOptional()
    gender?: string;

    @ApiPropertyOptional()
    phone_number?: string;

    @ApiPropertyOptional()
    phone_carrier?: string;

    @ApiPropertyOptional()
    ci?: string;

    @ApiPropertyOptional()
    pay_account_id?: string;

    @ApiPropertyOptional({ description: '[필수 X] kakao 로그인 사용자의 이메일' })
    email?: string;
}

export class GoogleSocialRequest {
    
    @ApiPropertyOptional()
    iss?: string;
    
    @ApiPropertyOptional()
    nbf?: number;
    
    @ApiPropertyOptional()
    aud?: string;
    
    @ApiProperty({ description: '[필수 O] google 로그인 사용자의 식별값', required: true })
    @IsNotEmpty({ message: 'social sub is required.' })
    sub: string;
    
    @ApiPropertyOptional()
    hd?: string;
    
    @ApiProperty({ description: '[필수 X] google 로그인 사용자의 이메일', required: false })
    email?: string;
    
    @ApiPropertyOptional()
    email_verified?: boolean;
    
    @ApiPropertyOptional()
    azp?: string;
    
    @ApiPropertyOptional()
    name?: string;
    
    @ApiPropertyOptional()
    picture?: string;
    
    @ApiPropertyOptional()
    given_name?: string;
    
    @ApiPropertyOptional()
    family_name?: string;
    
    @ApiPropertyOptional()
    iat?: number;
    
    @ApiPropertyOptional()
    exp?: number;
    
    @ApiPropertyOptional()
    jti?: string;
}

export class NaverSocialRequest {
    
    @ApiProperty({ description: '[필수 X] naver 로그인 사용자의 이메일', required: false })
    email?: string;
    
    @ApiPropertyOptional()
    nickname?: string;
    
    @ApiPropertyOptional()
    profile_image?: string;
    
    @ApiPropertyOptional()
    age?: string;
    
    @ApiPropertyOptional()
    gender?: string;
    
    @ApiProperty({ description: '[필수 O] naver 로그인 사용자의 식별값', required: true })
    @IsNotEmpty({ message: 'social id is required.' })
    id: string;
    
    @ApiPropertyOptional()
    name?: string;
    
    @ApiPropertyOptional()
    birthday?: string;
    
    @ApiPropertyOptional()
    birthyear?: string;
    
    @ApiPropertyOptional()
    mobile?: string;
}

export class AppleSocialRequest {
    
    @ApiPropertyOptional()
    iss?: string;
    
    @ApiPropertyOptional()
    aud?: string;
    
    @ApiPropertyOptional()
    exp?: number;
    
    @ApiPropertyOptional()
    iat?: number;
    
    @ApiProperty({ description: '[필수 O] apple 로그인 사용자의 식별값', required: true })
    @IsNotEmpty({ message: 'social sub is required.' })
    sub: string;
    
    @ApiPropertyOptional()
    at_hash?: string;
    
    @ApiProperty({ description: '[필수 X] apple 로그인 사용자의 이메일', required: false })
    email?: string;
    
    @ApiPropertyOptional()
    email_verified?: string;
    
    @ApiPropertyOptional()
    is_private_email?: string;
}