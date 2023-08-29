import { Args, Mutation, Query, Resolver } from "@nestjs/graphql";
import { UserService } from "./users.service";
import { User } from "./entities/user.entity";
import { AppleSocialInput, GoogleSocialInput, KakaoSocialInput, NaverSocialInput, SocialOutput } from "./dtos/social-login-dto";
import { Vendor } from "./entities/vendor.type";
import { UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "./decorator/jwt.auth.guard";
import { LoginUserInfo } from "./decorator/current.user.decorator";

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

    /*
      Client tokenTestAndCheckCurrentUser 요청
      -> JwtAuthGuard (request 객체를 추출해서 JwtStrategy로 전달)
      -> JwtStrategy (request 객체에서 Header의 토큰을 추출해서 검증 후 토큰의 payload를 validate에 넘겨줌)
      -> validate (payload를 받아서 context.req.user에 반환값을 넣어줌)
      -> LoginUserInfo (context.req.user에 있는 데이터를 뽑아서 변수에 넣어줌)
    */
    @UseGuards(JwtAuthGuard)
    @Query(returns => Boolean)
    tokenTestAndCheckCurrentUser(@LoginUserInfo() { userId }) {
        return true;
    }
}