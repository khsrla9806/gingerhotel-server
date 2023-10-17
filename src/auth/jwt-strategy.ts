import { Injectable, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { InjectRepository } from "@nestjs/typeorm";
import { ExtractJwt, Strategy } from "passport-jwt";
import { Member } from "src/entities/member.entity";
import { Repository } from "typeorm";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {

  constructor(
    @InjectRepository(Member)
    private readonly memberRepository: Repository<Member>,
    private readonly configService: ConfigService
  ) {
    super({
      secretOrKey: configService.get('JWT_SECRET_KEY'),
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
    });
  }

  /**
   * Bearer 토큰 검사 후에 실행되는 method
   * @param payload: jwt token의 payload
   * @returns Request 객체에 담아줄 member를 반환 (AuthGuard 사용해야 적용)
   */
  async validate(payload: any) {
    const { memberId } = payload;
    const member: Member = await this.memberRepository.findOne({ where: { id: memberId } });

    if (!member) {
      throw new UnauthorizedException('인증되지 않은 사용자입니다.');
    }

    return member;
  }
}