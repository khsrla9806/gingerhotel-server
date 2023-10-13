import { ExecutionContext, createParamDecorator } from "@nestjs/common";
import { User } from "src/entities/user.entity";

/**
 * context에서 Request 객체를 얻어내서 Request에 있는 user를 뽑아내는 파라미터 전용 데코레이터
 */
export const LoginUser = createParamDecorator((data, context: ExecutionContext): User => {
  const request = context.switchToHttp().getRequest();

  return request.user;
});