import { Args, Mutation, Query, Resolver } from "@nestjs/graphql";
import { UserService } from "./users.service";
import { User } from "./entities/user.entity";
import { AppleSocialInput, GoogleSocialInput, KakaoSocialInput, NaverSocialInput, SocialOutput } from "./dtos/social-login-dto";
import { Vendor } from "./entities/vendor.type";

@Resolver(of => User)
export class UserResolver {
    constructor(
      private readonly userService: UserService
    ) {}

    @Mutation(returns => SocialOutput)
    async socialKakao(@Args('data') data: KakaoSocialInput) {

      return this.userService.loginSocial(data.email, data.id, Vendor.KAKAO);
    }

    @Mutation(returns => SocialOutput)
    async socialGoogle(@Args('data') data: GoogleSocialInput) {

      return this.userService.loginSocial(data.email, data.sub, Vendor.GOOGLE);
    }

    @Mutation(returns => SocialOutput)
    async socialNaver(@Args('data') data: NaverSocialInput) {

      return this.userService.loginSocial(data.email, data.id, Vendor.NAVER);
    }

    @Mutation(returns => SocialOutput)
    async socialApple(@Args('data') data: AppleSocialInput) {

      return this.userService.loginSocial(data.email, data.sub, Vendor.APPLE);
    }

    @Query(returns => Boolean)
    hi() {
        return true;
    }
}