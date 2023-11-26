import { applyDecorators } from "@nestjs/common";
import { ApiBadRequestResponse, ApiBearerAuth, ApiBody, ApiOkResponse, ApiOperation, ApiQuery } from "@nestjs/swagger";
import { CursorPageOptionDTO } from "src/common/dto/cursor-page-option.dto";
import { CreateDeviceRequestDTO } from "src/notifications/dto/create-device.dto";

export function GetNotificationsAPI() {
  return applyDecorators(
    ApiOperation({ summary: '내 알림 목록 조회', description: '내 알림 목록을 조회합니다.' }),
    ApiOkResponse({
      description: '조회 성공',
      schema: {
        example: {
          "data": [
            {
              "id": 31000120,
              "createdAt": "2023-11-10T21:36:27.473",
              "type": "FEEK_REJECT",
              "typeData": {
                  "hotelId": 4,
                  "date": "2023-11-10"
              },
              "message": "너 102만 유저네? 대박님께서 엿보기를 거절했어요 :(",
              "isChecked": false
            },
            {
              "id": 31000119,
              "createdAt": "2023-11-10T21:36:01.598",
              "type": "FEEK_ACCEPT",
              "typeData": {
                  "hotelId": 4,
                  "date": "2023-11-10"
              },
              "message": "너 102만 유저네? 대박님께서 엿보기를 수락했어요!",
              "isChecked": false
            },
            {
              "id": 31000118,
              "createdAt": "2023-11-10T21:32:48.838",
              "type": "WINDOW_OPEN",
              "typeData": {
                  "hotelId": 4,
                  "date": "2023-11-10"
              },
              "message": "오늘의 창문이 열렸어요! 확인하러 갈까요?",
              "isChecked": false
            },
            {
              "id": 31000116,
              "createdAt": "2023-11-10T21:31:38.557",
              "type": "LETTER",
              "typeData": {
                  "hotelId": 4,
                  "date": "2023-11-10"
              },
              "message": "두근두근! 새 편지 도착!",
              "isChecked": false
            },
            {
              "id": 31000091,
              "createdAt": "2023-11-10T21:30:25.568",
              "type": "REPLY",
              "typeData": {
                  "letterId": 19000020
              },
              "message": "편지함에 답장이 도착했어요!",
              "isChecked": false
            },
            {
              "id": 25000071,
              "createdAt": "2023-11-10T00:46:55.375",
              "type": "FEEK_REQUEST",
              "typeData": {
                  "feekId": 2
              },
              "message": "4번섭님께서 엿보기를 요청했어요!",
              "isChecked": true
            },
            {
              "id": 25000069,
              "createdAt": "2023-11-10T00:46:55.375",
              "type": "FEEK_REQUEST",
              "typeData": {
                  "feekId": 2
              },
              "message": "4번섭님께서 엿보기를 요청했어요!",
              "isChecked": true
            },
            {
              "id": 25000068,
              "createdAt": "2023-11-10T00:46:55.375",
              "type": "FEEK_REQUEST",
              "typeData": {
                  "feekId": 2
              },
              "message": "4번섭님께서 엿보기를 요청했어요!",
              "isChecked": true
            },
            {
              "id": 25000067,
              "createdAt": "2023-11-10T00:46:55.375",
              "type": "FEEK_REQUEST",
              "typeData": {
                  "feekId": 2
              },
              "message": "4번섭님께서 엿보기를 요청했어요!",
              "isChecked": true
            },
            {
              "id": 15000055,
              "createdAt": "2023-11-10T00:46:55.375",
              "type": "FEEK_REQUEST",
              "typeData": {
                  "feekId": 2
              },
              "message": "4번섭님께서 엿보기를 요청했어요!",
              "isChecked": true
            }
          ],
          "meta": {
              "total": 40,
              "size": 10,
              "hasNextData": true,
              "cursor": 15000055
          }
        }
      }
    }),
    ApiBearerAuth('Authorization')
  );
}

export function DeleteNotificationAPI() {
  return applyDecorators(
    ApiOperation({ summary: '내 알림 삭제', description: '내 알림을 삭제합니다.' }),
    ApiOkResponse({
      description: '삭제 성공',
      schema: {
        example: {
          success: true
        }
      }
    }),
    ApiBadRequestResponse({
      description: '삭제 실패',
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

export function CreateDeviceAPI() {
  return applyDecorators(
    ApiOperation({ summary: '푸시 알림을 위한 디바이스 등록', description: '푸시 알림을 위한 디바이스 정보를 등록합니다.' }),
    ApiBody({ 
      description: '디바이스 등록을 위한 ', 
      type: CreateDeviceRequestDTO
    }),
    ApiOkResponse({
      description: '디바이스 등록 성공',
      schema: {
        example: {
          "success": true
        }
      }
    }),
    ApiBadRequestResponse({
      description: '디바이스 등록 실패',
      schema: {
        example: {
          "success": false,
          "errorCode": '1004',
          "errorMessage": '에러 메시지'
        }
      }
    }),
    ApiBearerAuth('Authorization')
  );
}