import { applyDecorators } from "@nestjs/common";
import { ApiBadRequestResponse, ApiBearerAuth, ApiOkResponse, ApiOperation, ApiQuery } from "@nestjs/swagger";
import { CursorPageOptionDTO } from "src/common/dto/cursor-page-option.dto";

export function GetNotificationsAPI() {
  return applyDecorators(
    ApiOperation({ summary: '내 알림 목록 조회', description: '내 알림 목록을 조회합니다.' }),
    ApiOkResponse({
      description: '조회 성공',
      schema: {
        example: {
          "data": [
              {
                  "id": 25000072,
                  "createdAt": "2023-11-10T00:46:55.375",
                  "type": "FEEK_REQUEST",
                  "typeData": {
                      "feekId": 2
                  },
                  "message": "4번섭님께서 엿보기를 요청했어요!",
                  "isChecked": true
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
                  "id": 25000070,
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
                  "id": 15000056,
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
              },
              {
                  "id": 15000054,
                  "createdAt": "2023-11-10T00:46:55.375",
                  "type": "FEEK_REQUEST",
                  "typeData": {
                      "feekId": 2
                  },
                  "message": "4번섭님께서 엿보기를 요청했어요!",
                  "isChecked": true
              },
              {
                  "id": 15000053,
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
              "total": "40",
              "size": 10,
              "hasNextData": true,
              "cursor": 15000053
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
          success: false,
          error: "존재하지 않는 알림 정보입니다. | 내 알림만 삭제가 가능합니다."
        }
      }
    }),
    ApiBearerAuth('Authorization')
  );
}