import { applyDecorators } from "@nestjs/common";
import { ApiBadRequestResponse, ApiBearerAuth, ApiBody, ApiOkResponse, ApiOperation } from "@nestjs/swagger";
import { HotelUpdateRequest } from "src/hotel/dto/hotel-update.dto";

export function GetHotelAPI() {
  return applyDecorators(
    ApiOperation({ summary: '호텔 메인 페이지 정보 응답', description: '메인 호텔 페이지에 필요한 데이터를 응답합니다. (Authorization=Optional)' }),
    ApiOkResponse({
      description: '응답 성공',
      schema: {
        example: {
          success: true,
          todayReceivedLetterCount: 8,
          feekCount: 18,
          keyCount: 0,
          hotel: {
              nickname: "헤르미온느",
              description: "제 호텔에 오신것을 환영합니다.",
              headColor: "#fffff",
              bodyColor: "#fffff"
          },
          hotelWindows: {
              "2023-12-01": {
                  id: 1,
                  isOpen: true,
                  hasCookie: true
              },
              "2023-12-04": {
                  id: 3,
                  isOpen: true,
                  hasCookie: true
              }
          },
          isLoginMember: true,
          isOwner: true,
          isFriend: false,
          isBlocked: false
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

export function UpdateHotelAPI() {
  return applyDecorators(
    ApiOperation({ summary: '호텔 정보 수정', description: '호텔 정보를 수정합니다.' }),
    ApiBody({ description: '수정할 호텔 데이터를 입력합니다.', type: HotelUpdateRequest }),
    ApiOkResponse({
      description: '호텔 수정 성공',
      schema: {
        example: {
          success: true,
          hotelId: 12
        }
      }
    }),
    ApiBadRequestResponse({
      description: '호텔 수정 실패',
      schema: {
        example: {
          success: false,
          error: '존재하지 않는 호텔 정보입니다. 호텔 생성을 완료 후 이용해주세요. | 자신의 호텔 정보만 수정이 가능합니다.'
        }
      }
    }),
    ApiBearerAuth('Authorization')
  );
}