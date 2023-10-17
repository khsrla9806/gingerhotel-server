import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { InjectRepository } from "@nestjs/typeorm";
import { Observable } from "rxjs";
import { Member } from "src/entities/member.entity";
import { Repository } from "typeorm";

/**
 * 로그인 사용자 / 비로그인 사용자 모두 사용가능한 Request에서 AuthGuard 대신 사용
 */
@Injectable()
export class MemberInterceptor implements NestInterceptor {
  constructor(
    @InjectRepository(Member)
    private readonly memberRepository: Repository<Member>,
    private readonly jwtService: JwtService
  ) {}

  async intercept(context: ExecutionContext, next: CallHandler<any>): Promise<Observable<any>> {
    // Controller 진입 전 실행하는 코드
    const request = context.switchToHttp().getRequest();

    // 헤더에서 토큰을 추출
    const { authorization } = request.headers;

    if (authorization) {
      try {
        const token = authorization.replace('Bearer ', '').replace('bearer ', '');
        const payload = this.jwtService.verify(token);
        const loginMember = await this.memberRepository.findOne({ where: { id: payload.memberId } });
        request.user = loginMember;

      } catch (e) {
        // 유효하지 않은 토큰은 에러에 걸림 = 로그인하지 않은 사용자로 판단하고 어떤 처리도 하지 않음
      }
    }

    return next.handle();
  }
}