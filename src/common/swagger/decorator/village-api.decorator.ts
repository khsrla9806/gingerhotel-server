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
          "success": false,
          "errorCode": '1003',
          "errorMessage": '에러 메시지'
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
          "success": false,
          "errorCode": '1003',
          "errorMessage": '에러 메시지'
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
                  structColor: "#2E9AFE",
                  bodyColor: "#2E9AFE"
              },
              {
                  villageId: 2,
                  isBookmark: false,
                  hotelId: 3,
                  nickname: "해리",
                  structColor: "#2E9AFE",
                  bodyColor: "#2E9AFE"
              },
              {
                  villageId: 5,
                  isBookmark: false,
                  hotelId: 7,
                  nickname: "론",
                  structColor: "#2E9AFE",
                  bodyColor: "#2E9AFE"
              },
              {
                  villageId: 6,
                  isBookmark: false,
                  hotelId: 8,
                  nickname: "말포이",
                  structColor: "#2E9AFE",
                  bodyColor: "#2E9AFE"
              },
              {
                  villageId: 7,
                  isBookmark: false,
                  hotelId: 9,
                  nickname: "김진저",
                  structColor: "#2E9AFE",
                  bodyColor: "#2E9AFE"
              },
              {
                  villageId: 8,
                  isBookmark: false,
                  hotelId: 10,
                  nickname: "이진저",
                  structColor: "#2E9AFE",
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

export function CreateVillageByCodeAPI() {
  return applyDecorators(
    ApiOperation({ summary: '코드 이용하여 빌리지에 사용자 등록', description: '사용자의 코드를 이용하여 빌리지에 추가합니다.' }),
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
          "success": false,
          "errorCode": '1003',
          "errorMessage": '에러 메시지'
        }
      }
    }),
    ApiBearerAuth('Authorization')
  );
}