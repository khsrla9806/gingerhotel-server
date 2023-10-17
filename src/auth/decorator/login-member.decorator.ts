import { ExecutionContext, createParamDecorator } from "@nestjs/common";
import { Member } from "src/entities/member.entity";

/**
 * context에서 Request 객체를 얻어내서 Request에 있는 member 뽑아내는 파라미터 전용 데코레이터
 */
export const LoginMember = createParamDecorator((data, context: ExecutionContext): Member => {
  const request = context.switchToHttp().getRequest();

  return request.user;
});