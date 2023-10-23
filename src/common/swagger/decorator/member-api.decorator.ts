import { applyDecorators } from "@nestjs/common";
import { ApiBadRequestResponse, ApiBearerAuth, ApiOkResponse, ApiOperation } from "@nestjs/swagger";

export function GetMemberInfoAPI() {
  return applyDecorators(
    ApiOperation({ summary: '마이페이지 데이터 조회', description: '요청한 사용자의 데이터를 반환합니다.' }),
    ApiOkResponse({
      description: '마이페이지 조회에 성공했을 때',
      schema: {
        example: {
          success: true,
          nickname: '헤르미온느',
          code: '2EFd54a',
          membership: 'DELUXE',
          keyCount: 2,
          feekCount: 0,
          myHotelId: 12
        }
      }
    }),
    ApiBadRequestResponse({
      description: '마이페이지 조회에 실패했을 때',
      schema: {
        example: {
          success: false,
          error: '자신의 정보만 요청이 가능합니다. | 사용자의 호텔이 존재하지 않습니다. 호텔 생성을 완료 후 이용해주세요.'
        }
      }
    }),
    ApiBearerAuth('Authorization')
  );
}