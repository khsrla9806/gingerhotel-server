import { applyDecorators } from "@nestjs/common";
import { ApiBadRequestResponse, ApiBearerAuth, ApiBody, ApiCreatedResponse, ApiForbiddenResponse, ApiOkResponse, ApiOperation, ApiQuery } from "@nestjs/swagger";
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
              structColor: "#fffff",
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

export function OpenWindowAPI() {
  return applyDecorators(
    ApiOperation({ summary: '열쇠로 호텔 창문 열기', description: '열쇠를 사용해서 특정 날짜의 호텔 창문을 개방합니다.' }),
    ApiQuery({
      name: 'date',
      type: 'yyyy-MM-dd',
      example: '2023-12-01',
      description: '개방하려는 창문의 날짜를 입력 (Ex. 1번 창문의 경우 2023-12-01)'
    }),
    ApiCreatedResponse({
      description: '창문 개방 성공',
      schema: {
        example: {
          success: true
        }
      }
    }),
    ApiBadRequestResponse({
      description: '창문 개방 실패',
      schema: {
        example: {
          success: false,
          error: '존재하지 않는 창문입니다. | 이미 열려있는 창문입니다. | 열쇠 개수가 부족합니다.'
        }
      }
    }),
    ApiForbiddenResponse({
      description: '창문 개방 실패',
      schema: {
        example: {
          success: false,
          error: '내 호텔의 창문만 열 수 있습니다.'
        }
      }
    }),
    ApiBearerAuth('Authorization')
  );
}

export function UnlimitWindowAPI() {
  return applyDecorators(
    ApiOperation({ summary: '해당 날짜의 편지 제한수를 해제', description: '해당 날짜에 해당하는 편지함의 편지 제한수를 해제합니다.' }),
    ApiQuery({
      name: 'date',
      type: 'yyyy-MM-dd',
      example: '2023-12-01',
      description: '제한 해제하려는 창문(편지함)의 날짜를 입력 (Ex. 1번 창문의 경우 2023-12-01)'
    }),
    ApiCreatedResponse({
      description: '편지 제한수 해제 성공',
      schema: {
        example: {
          success: true
        }
      }
    }),
    ApiBadRequestResponse({
      description: '편지 제한수 해제 실패',
      schema: {
        example: {
          success: false,
          error: '존재하지 않는 창문입니다. | 오늘 편지 제한수를 이미 해제했습니다.'
        }
      }
    }),
    ApiForbiddenResponse({
      description: '창문 개방 실패',
      schema: {
        example: {
          success: false,
          error: '내 호텔의 창문이 아닙니다.'
        }
      }
    }),
    ApiBearerAuth('Authorization')
  );
}