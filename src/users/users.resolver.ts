import { Args, Mutation, Query, Resolver } from "@nestjs/graphql";
import { UserService } from "./users.service";
import { User } from "./entities/user.entity";
import { AppleSocialInput, GoogleSocialInput, KakaoSocialInput, NaverSocialInput, SocialOutput } from "./dtos/social-login-dto";

@Resolver(of => User)
export class UserResolver {
    constructor(
      private readonly usersService: UserService
    ) {}

    @Mutation(returns => SocialOutput)
    async socialKakao(@Args('data') data: KakaoSocialInput) {

      return {
        ok: true,
        accessToken: "카카오 사용자"
      };
    }

    @Mutation(returns => SocialOutput)
    async socialGoogle(@Args('data') data: GoogleSocialInput) {
      
      return {
        ok: true,
        accessToken: "구글 사용자"
      };
    }

    @Mutation(returns => SocialOutput)
    async socialNaver(@Args('data') data: NaverSocialInput) {
      
      return {
        ok: true,
        accessToken: "네이버 사용자"
      };
    }

    @Mutation(returns => SocialOutput)
    async socialApple(@Args('data') data: AppleSocialInput) {
      
      return {
        ok: true,
        accessToken: "애플 사용자"
      };
    }

    @Query(returns => Boolean)
    hi() {
        return true;
    }
}