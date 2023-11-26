import { applyDecorators } from "@nestjs/common";
import { ApiBadRequestResponse, ApiBearerAuth, ApiBody, ApiConsumes, ApiCreatedResponse, ApiForbiddenResponse, ApiHeader, ApiOkResponse, ApiOperation, ApiQuery } from "@nestjs/swagger";
import { CreateLetterRequest } from "src/letters/dto/create-letter.dto";

export function CreateLetterAPI() {
  return applyDecorators(
    ApiOperation({ summary: '편지 쓰기', description: '사용자가 입력한 편지 정보로 편지를 생성합니다.' }),
    ApiBody({ description: '사용자가 입력한 편지 정보 + 이미지 파일(Optional) (Required Member Token)', type: CreateLetterRequest }),
    ApiCreatedResponse({
      description: '편지 생성에 성공했을 때',
      schema: {
        example: {
          success: true
        }
      }
    }),
    ApiBadRequestResponse({
      description: '편지 생성에 실패했을 때',
      schema: {
        example: {
          "success": false,
          "errorCode": '3006',
          "errorMessage": '에러 메시지'
        }
      }
    }),
    ApiBearerAuth('Authorization'),
    ApiConsumes('multipart/form-data')
  );
}

export function DeleteLetterAPI() {
  return applyDecorators(
    ApiOperation({ summary: '편지 삭제', description: '사용자가 편지를 삭제합니다.' }),
    ApiOkResponse({
      description: '편지 삭제 성공',
      schema: {
        example: {
          success: true
        }
      }
    }),
    ApiBadRequestResponse({
      description: '편지 삭제 실패',
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

export function CheckBlockedAPI() {
  return applyDecorators(
    ApiOperation({ summary: '답장 보내기 전에 상대방에게 차단되었는지 확인', description: 'letterId를 통해서 상대방에게 차단 되었는지 확인한다.' }),
    ApiOkResponse({
      description: '차단 여부 확인 완료',
      schema: {
        example: {
          "success": true,
          "isBlockMe": false,
          "message": "상대방이 나를 차단하지 않았습니다."
        }
      }
    }),
    ApiBadRequestResponse({
      description: '차단 여부 확인 실패',
      schema: {
        example: {
          "success": false,
          "errorCode": '1003',
          "errorMessage": '에러 메시지'
        }
      }
    }),
    ApiForbiddenResponse({
      description: '접근 권한 없음 (편지를 받은 사람과 보낸 사람만 접근이 가능)',
      schema: {
        example: {
          "success": false,
          "error": "접근 권한이 없습니다."
        }
      }
    }),
    ApiBearerAuth('Authorization')
  );
}

export function BlockLetterAPI() {
  return applyDecorators(
    ApiOperation({ summary: '편지 차단', description: '사용자가 편지를 보낸 사람을 차단합니다.' }),
    ApiOkResponse({
      description: '편지 차단 성공',
      schema: {
        example: {
          success: true
        }
      }
    }),
    ApiBadRequestResponse({
      description: '편지 차단 실패',
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

export function UnblockLetterAPI() {
  return applyDecorators(
    ApiOperation({ summary: '편지 차단 해제', description: '사용자가 차단된 편지를 차단 해제합니다.' }),
    ApiOkResponse({
      description: '편지 차단 해제 성공',
      schema: {
        example: {
          success: true
        }
      }
    }),
    ApiBadRequestResponse({
      description: '편지 차단 해제 실패',
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

export function GetLettersAPI() {
  return applyDecorators(
    ApiOperation({ summary: '내 편지함 조회 (편지 + 답장)', description: '선택한 날짜에(yyyy-MM-dd)에 해당하는 창문에 도착한 편지와 답장을 조회합니다.' }),
    ApiHeader({
      name: 'Notification',
      description: '알림 페이지에서 접근한 경우에 추가되는 notificationId (Ex. 1)',
      required: false
    }),
    ApiQuery({
      name: 'date',
      type: 'yyyy-MM-dd',
      example: '2023-12-01',
      description: '조회하려는 편지함(창문)의 날짜를 입력 (Ex. 1번 창문의 경우 2023-12-01)'
    }),
    ApiOkResponse({
      description: '편지함 조회 성공',
      schema: {
        example: {
          success: true,
          letters: [
              {
                  id: 5,
                  createdAt: "2023-10-24T17:38:02.317",
                  senderNickname: "삼번유저",
                  content: "안녕~~친구야~~~",
                  isBlocked: false,
                  imageUrl: "저장된 image URL",
                  feekStatus: "REJECT",
                  feekComment: null
              },
              {
                  id: 4,
                  createdAt: "2023-10-24T16:28:02.317",
                  senderNickname: "삼번유저",
                  content: "안녕~~친구야~~~",
                  isBlocked: false,
                  imageUrl: "저장된 image URL",
                  feekStatus: "REQUEST",
                  feekComment: null
              },
              {
                  id: 3,
                  createdAt: "2023-10-24T16:18:02.317",
                  senderNickname: "삼번유저",
                  content: "안녕~~친구야~~~",
                  isBlocked: false,
                  imageUrl: "저장된 image URL",
                  feekStatus: "ACCEPT",
                  feekComment: "너 뒤에 앉은 사람"
              },
              {
                  id: 2,
                  createdAt: "2023-10-24T16:09:02.317",
                  senderNickname: "삼번유저",
                  content: "안녕~~친구야~~~",
                  isBlocked: false,
                  imageUrl: "저장된 image URL",
                  feekStatus: null,
                  feekComment: null
              },
              {
                  id: 1,
                  createdAt: "2023-10-24T16:03:02.317",
                  senderNickname: "삼번유저",
                  content: "안녕~~친구야~~~",
                  isBlocked: false,
                  imageUrl: "저장된 image URL",
                  feekStatus: "ACCEPT",
                  feekComment: "너랑 같은 반임"
              }
          ],
          "replies": [
              {
                  id: 5,
                  letterId: 1,
                  createdAt: "2023-10-24T18:22:22.543",
                  content: "9번 편지에 3번 유저가 보내는 답장(4)",
                  isBlocked: false,
                  imageUrl: "저장된 image URL",
                  senderNickname: "삼번유저"
              },
              {
                  id: 4,
                  letterId: 1,
                  createdAt: "2023-10-24T17:38:53.183",
                  content: "9번 편지에 3번 유저가 보내는 답장(3)",
                  isBlocked: false,
                  imageUrl: "저장된 image URL",
                  senderNickname: "삼번유저"
              },
              {
                  id: 3,
                  letterId: 1,
                  createdAt: "2023-10-24T17:38:15.780",
                  content: "9번 편지에 3번 유저가 보내는 답장(2)",
                  isBlocked: false,
                  imageUrl: "저장된 image URL",
                  senderNickname: "삼번유저"
              },
              {
                  id: 2,
                  letterId: 1,
                  createdAt: "2023-10-24T17:38:02.317",
                  content: "9번 편지에 3번 유저가 보내는 답장(1)",
                  isBlocked: false,
                  imageUrl: "저장된 image URL",
                  senderNickname: "삼번유저"
              }
          ]
      }
      }
    }),
    ApiBadRequestResponse({
      description: '편지함 조회 실패',
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

export function GetRepliesAPI() {
  return applyDecorators(
    ApiOperation({ summary: '답장 모아보기', description: 'letter의 식별자를 이용하여 답장 모아보기 페이지로 이동' }),
    ApiHeader({
      name: 'Notification',
      description: '알림 페이지에서 접근한 경우에 추가되는 notificationId (Ex. 1)',
      required: false
    }),
    ApiQuery({
      name: 'sort',
      type: '"ASC" | "DESC"',
      example: 'ASC',
      description: '답장의 createdAt 정렬 조건을 직접 선택할 수 있습니다. 옵션 값이기 때문에 입력하지 않으면 자동으로 DESC 정렬합니다.',
      required: false
    }),
    ApiOkResponse({
      description: '조회 성공',
      schema: {
        description: '최초 편지를 받은 사람이 요청한 경우',
        example: {
          success: true,
          letter: {
            id: 9,
            nickname: "최초 편지를 쓴 사람의 닉네임",
            content: "다음주에 나랑 영화보러 갈래?",
            date: "2023-10-24",
            isOpen: true,
            isBlocked: false,
            isMe: false,
            createdAt: "2023-10-24T17:38:02.317",
            feekStatus: "ACCEPT",
            feekComment: "나 안경끼고 다녀"
          },
          replies: [
            {
              id: 5,
              nickname: "최초 편지를 받은 사람의 닉네임",
              content: "나 돈 없어 그냥 알려줘.",
              date: "2023-10-24",
              isOpen: true,
              isBlocked: false,
              isMe: true,
              createdAt: "2023-10-24T18:22:22.543"
            },
            {
              id: 4,
              nickname: "최초 편지를 쓴 사람의 닉네임",
              content: "궁금하면 돈 써서 알아내야지",
              date: "2023-10-24",
              isOpen: true,
              isBlocked: false,
              isMe: false,
              createdAt: "2023-10-24T17:38:53.183"
            },
            {
              id: 3,
              nickname: "최초 편지를 받은 사람의 닉네임",
              content: "엿보기 기능 그거 돈 드는 거 아니야?",
              date: "2023-10-24",
              isOpen: true,
              isBlocked: false,
              isMe: true,
              createdAt: "2023-10-24T17:38:15.780"
            },
            {
              id: 2,
              nickname: "최초 편지를 쓴 사람의 닉네임",
              content: "그건 알고 싶으면 엿보기 기능 써봐",
              date: "2023-10-24",
              isOpen: true,
              isBlocked: false,
              isMe: false,
              createdAt: "2023-10-24T17:38:02.317"
            },
            {
              id: 1,
              nickname: "최초 편지를 받은 사람의 닉네임",
              content: "너가 누군지 알려줘야지 영화보러 가지",
              date: "2023-10-24",
              isOpen: true,
              isBlocked: false,
              isMe: true,
              createdAt: "2023-10-24T17:38:02.317"
            }
          ]
      }
      }
    }),
    ApiBadRequestResponse({
      description: '조회 실패',
      schema: {
        example: {
          "success": false,
          "errorCode": '1003',
          "errorMessage": '에러 메시지'
        }
      }
    }),
    ApiForbiddenResponse({
      description: '권한이 없는 사용자',
      schema: {
        example: {
          success: false,
          error: '편지 주인과 편지를 보낸 사람만 조회가 가능합니다.'
        }
      }
    }),
    ApiBearerAuth('Authorization')
  );
}
