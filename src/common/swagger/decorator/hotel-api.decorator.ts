import { applyDecorators } from "@nestjs/common";
import { ApiBadRequestResponse, ApiBearerAuth, ApiOkResponse, ApiOperation } from "@nestjs/swagger";

export function GetHotelAPI() {
  return applyDecorators(
    ApiOperation({ summary: '호텔 메인 페이지 정보 응답', description: '메인 호텔 페이지에 필요한 데이터를 응답합니다. (Authorization=Optional)' }),
    ApiOkResponse({
      description: '응답 성공',
      schema: {
        example: {
          success: true,
          todayReceivedLetterCount: 2,
          hotel: {
            headColor: '#2E9AFE',
            bodyColor: '#2E9AFE'
          },
          isLoginMember: true,
          isOwner: true,
          isFriend: false
        }
      }
    }),
    ApiBadRequestResponse({
      description: '응답 실패',
      schema: {
        example: {
          success: false,
          error: '존재하지 않는 호텔 정보입니다.'
        }
      }
    }),
    ApiBearerAuth('Authorization')
  );
}