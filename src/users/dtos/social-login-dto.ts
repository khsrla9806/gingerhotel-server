import { ArgsType, Field, InputType, ObjectType } from "@nestjs/graphql";
import { CoreOutput } from "src/common/dtos/output.dto";

@ObjectType()
export class SocialOutput extends CoreOutput {
    
    @Field(type => String)
    accessToken?: string;
}

@InputType()
export class KakaoSocialInput {

    @Field(type => String)
    id: string;

    @Field(type => String)
    name: string;

    @Field(type => String)
    birthday: string;

    @Field(type => String)
    gender: string;

    @Field(type => String)
    phone_number: string;

    @Field(type => String)
    phone_carrier: string;

    @Field(type => String)
    ci: string;

    @Field(type => String)
    pay_account_id: string;

    @Field(type => String, { nullable: true })
    email?: string;
}

@InputType()
export class GoogleSocialInput {
    
    @Field(type => String)
    iss: string;

    @Field(type => Number)
    nbf: number;

    @Field(type => String)
    aud: string;

    @Field(type => String)
    sub: string;

    @Field(type => String)
    hd: string;

    @Field(type => String, { nullable: true })
    email?: string;

    @Field(type => Boolean)
    email_verified: boolean;

    @Field(type => String)
    azp: string;

    @Field(type => String)
    name: string;

    @Field(type => String)
    picture: string;

    @Field(type => String)
    given_name: string;

    @Field(type => String)
    family_name: string;

    @Field(type => Number)
    iat: number;

    @Field(type => Number)
    exp: number;

    @Field(type => String)
    jti: string;
}

@InputType()
export class NaverSocialInput {

    @Field(type => String, { nullable: true })
    email?: string;

    @Field(type => String)
    nickname: string;

    @Field(type => String)
    profile_image: string;

    @Field(type => String)
    age: string;

    @Field(type => String)
    gender: string;

    @Field(type => String)
    id: string;

    @Field(type => String)
    name: string;

    @Field(type => String)
    birthday: string;

    @Field(type => String)
    birthyear: string;

    @Field(type => String)
    mobile: string;
}

@InputType()
export class AppleSocialInput {
    
    @Field(type => String)
    iss: string;

    @Field(type => String)
    aud: string;

    @Field(type => Number)
    exp: number;

    @Field(type => Number)
    iat: number;

    @Field(type => String)
    sub: string;

    @Field(type => String)
    at_hash: string;

    @Field(type => String, { nullable: true })
    email?: string;

    @Field(type => String)
    email_verified: string;

    @Field(type => String)
    is_private_email: string;
}