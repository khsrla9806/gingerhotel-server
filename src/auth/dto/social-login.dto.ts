import { CommonResponse } from "src/common/dto/output.dto";

export class SocialLoginResponse extends CommonResponse {
  accessToken?: string;
}

export class KakaoSocialRequest {
    id: string;
    name: string;
    birthday: string;
    gender: string;
    phone_number: string;
    phone_carrier: string;
    ci: string;
    pay_account_id: string;
    email?: string;
}

export class GoogleSocialRequest {
    iss: string;
    nbf: number;
    aud: string;
    sub: string;
    hd: string;
    email?: string;
    email_verified: boolean;
    azp: string;
    name: string;
    picture: string;
    given_name: string;
    family_name: string;
    iat: number;
    exp: number;
    jti: string;
}

export class NaverSocialRequest {
    email?: string;
    nickname: string;
    profile_image: string;
    age: string;
    gender: string;
    id: string;
    name: string;
    birthday: string;
    birthyear: string;
    mobile: string;
}

export class AppleSocialRequest {
    iss: string;
    aud: string;
    exp: number;
    iat: number;
    sub: string;
    at_hash: string;
    email?: string;
    email_verified: string;
    is_private_email: string;
}