import { applyDecorators } from "@nestjs/common";
import { ApiBadRequestResponse, ApiBearerAuth, ApiOkResponse, ApiOperation } from "@nestjs/swagger";

export function DeleteLetterAPI() {
  return applyDecorators(
    ApiOperation({ summary: 'Delete Letter API', description: '사용자가 편지를 삭제합니다.' }),
    ApiOkResponse({
      description: '편지 삭제 성공',
      schema: {
        example: {
          success: true
        }
      }
    }),
    ApiBadRequestResponse({
      description: '편지 삭제 실패',
      schema: {
        example: {
          success: false,
          error: '존재하지 않는 편지 정보입니다. | 자신이 받은 편지만 삭제할 수 있습니다.'
        }
      }
    }),
    ApiBearerAuth('accessToken')
  );
}