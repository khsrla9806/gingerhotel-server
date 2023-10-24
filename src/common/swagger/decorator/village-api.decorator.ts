import { applyDecorators } from "@nestjs/common";
import { ApiBadRequestResponse, ApiBearerAuth, ApiCreatedResponse, ApiOkResponse, ApiOperation, ApiUnauthorizedResponse } from "@nestjs/swagger";

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

export function GetVillagesAPI() {
  return applyDecorators(
    ApiOperation({ summary: '내 빌리지 조회', description: '내가 추가했던 빌리지 목록을 조회합니다.' }),
    ApiOkResponse({
      description: '빌리지 조회 성공',
      schema: {
        example: {
          success: true,
          villages: [
              {
                  villageId: 4,
                  isBookmark: true,
                  hotelId: 5,
                  nickname: "헤르미온느",
                  headColor: "#2E9AFE",
                  bodyColor: "#2E9AFE"
              },
              {
                  villageId: 2,
                  isBookmark: false,
                  hotelId: 3,
                  nickname: "해리",
                  headColor: "#2E9AFE",
                  bodyColor: "#2E9AFE"
              },
              {
                  villageId: 5,
                  isBookmark: false,
                  hotelId: 7,
                  nickname: "론",
                  headColor: "#2E9AFE",
                  bodyColor: "#2E9AFE"
              },
              {
                  villageId: 6,
                  isBookmark: false,
                  hotelId: 8,
                  nickname: "말포이",
                  headColor: "#2E9AFE",
                  bodyColor: "#2E9AFE"
              },
              {
                  villageId: 7,
                  isBookmark: false,
                  hotelId: 9,
                  nickname: "김진저",
                  headColor: "#2E9AFE",
                  bodyColor: "#2E9AFE"
              },
              {
                  villageId: 8,
                  isBookmark: false,
                  hotelId: 10,
                  nickname: "이진저",
                  headColor: "#2E9AFE",
                  bodyColor: "#2E9AFE"
              }
          ]
      }
      }
    }),
    ApiUnauthorizedResponse({
      description: '빌리지 조회 실패',
      schema: {
        example: {
          message: "Unauthorized",
          statusCode: 401
      }
      }
    }),
    ApiBearerAuth('Authorization')
  );
}