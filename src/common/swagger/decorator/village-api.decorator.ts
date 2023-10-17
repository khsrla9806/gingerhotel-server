import { applyDecorators } from "@nestjs/common";
import { ApiBadRequestResponse, ApiBearerAuth, ApiCreatedResponse, ApiOkResponse, ApiOperation } from "@nestjs/swagger";

export function CreateVillageAPI() {
  return applyDecorators(
    ApiOperation({ summary: '빌리지에 사용자 등록', description: '등록하고자 하는 호텔 식별자와 유저 토큰으로 빌리지 등록' }),
    ApiCreatedResponse({
      description: '빌리지 등록 성공',
      schema: {
        example: {
          success: true
        }
      }
    }),
    ApiBadRequestResponse({
      description: '빌리지 등록 실패',
      schema: {
        example: {
          success: false,
          error: '존재하지 않는 호텔 정보입니다. | 자기 자신은 빌리지에 추가할 수 없습니다. | 이미 내 빌리지에 등록한 사용자입니다.'
        }
      }
    }),
    ApiBearerAuth('Authorization')
  );
}

export function DeleteVillageAPI() {
  return applyDecorators(
    ApiOperation({ summary: '빌리지에서 사용자 삭제', description: '삭제하고자 하는 호텔 식별자와 유저 토큰으로 빌리지에서 삭제' }),
    ApiOkResponse({
      description: '빌리지 삭제 성공',
      schema: {
        example: {
          success: true
        }
      }
    }),
    ApiBadRequestResponse({
      description: '빌리지 삭제 실패',
      schema: {
        example: {
          success: false,
          error: '존재하지 않는 호텔 정보입니다. | 자기 자신을 빌리지에서 삭제할 수 없습니다. | 내 빌리지에 등록되어 있지 않은 사용자입니다.'
        }
      }
    }),
    ApiBearerAuth('Authorization')
  );
}