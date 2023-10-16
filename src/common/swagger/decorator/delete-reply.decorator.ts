import { applyDecorators } from "@nestjs/common";
import { ApiBadRequestResponse, ApiBearerAuth, ApiOkResponse, ApiOperation } from "@nestjs/swagger";

export function DeleteReplyAPI() {
  return applyDecorators(
    ApiOperation({ summary: 'Delete Reply API', description: '사용자가 답장을 삭제합니다.' }),
    ApiOkResponse({
      description: '답장 삭제 성공',
      schema: {
        example: {
          success: true
        }
      }
    }),
    ApiBadRequestResponse({
      description: '답장 삭제 실패',
      schema: {
        example: {
          success: false,
          error: '존재하지 않는 답장 정보입니다. | 자신이 받은 답장만 삭제할 수 있습니다.'
        }
      }
    }),
    ApiBearerAuth('accessToken')
  );
}