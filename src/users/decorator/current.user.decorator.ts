import { ExecutionContext, createParamDecorator } from "@nestjs/common";
import { GqlExecutionContext } from "@nestjs/graphql";

/**
 * 현재 로그인한 유저의 정보를 가져올 수 있는 데코레이터
 * @returns: { userId: number }
 */
export const LoginUserInfo = createParamDecorator(
    (data: unknown, context: ExecutionContext) => {
      const ctx = GqlExecutionContext.create(context);
      return ctx.getContext().req.user;
    },
);