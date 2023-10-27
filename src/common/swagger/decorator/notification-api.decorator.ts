import { applyDecorators } from "@nestjs/common";
import { ApiBadRequestResponse, ApiBearerAuth, ApiOkResponse, ApiOperation } from "@nestjs/swagger";

export function GetNotificationsAPI() {
  return applyDecorators(
    ApiOperation({ summary: '내 알림 목록 조회', description: '내 알림 목록을 조회합니다.' }),
    ApiOkResponse({
      description: '조회 성공',
      schema: {
        example: [
          {
            id: 37,
            createdAt: "2023-10-27T18:46:04.511",
            type: "FEEK_REQUEST",
            typeData: {
              feekId: 3
            },
            message: "유저 3님께서 엿보기를 요청했어요!",
            isChecked: false
          },
          {
            id: 35,
            createdAt: "2023-10-27T18:44:28.200",
            type: "FEEK_ACCEPT",
            typeData: {
              hotelId: 1,
              date: "2023-10-27"
            },
            message: "유저 3님께서 엿보기를 수락했어요!",
            isChecked: true
          },
          {
            id: 33,
            createdAt: "2023-10-27T18:42:31.200",
            type: "FEEK_REJECT",
            typeData: {
              hotelId: 1,
              date: "2023-10-27"
            },
            message: "유저 3님께서 엿보기를 거절했어요:(",
            isChecked: false
          },
          {
            id: 32,
            createdAt: "2023-10-27T18:01:49.219",
            type: "REPLY",
            typeData: {
              letterId: 36
            },
            message: "유저 4님으로부터 답장이 도착했어요!",
            isChecked: false
        },
          {
            id: 31,
            createdAt: "2023-10-27T18:00:51.717",
            type: "LETTER",
            typeData: {
              hotelId: 1,
              date: "2023-10-27"
            },
            message: "두근두근! 새 편지 도착!",
            isChecked: false
          },
        ]
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