import { LocalDate, LocalDateTime } from "@js-joda/core";
import { applyDecorators } from "@nestjs/common";
import { ApiBadRequestResponse, ApiBearerAuth, ApiBody, ApiConsumes, ApiCreatedResponse, ApiOkResponse, ApiOperation, ApiQuery } from "@nestjs/swagger";
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
          success: false,
          error: '이미지 첨부를 할 수 없는 멤버쉽 정보입니다. | 자신의 호텔에는 편지를 쓸 수 없습니다. | 수신자가 하루에 받을 수 있는 개수를 넘어섰습니다.'
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
          success: false,
          error: '존재하지 않는 편지 정보입니다. | 자신이 받은 편지만 삭제할 수 있습니다.'
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
          success: false,
          error: '존재하지 않는 편지 정보입니다. | 내가 받은 편지만 차단할 수 있습니다. | 이미 차단된 편지입니다.'
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
          success: false,
          error: '존재하지 않는 편지 정보입니다. | 내가 받은 편지만 차단 해제할 수 있습니다. | 차단 되어 있지 않은 편지입니다.'
        }
      }
    }),
    ApiBearerAuth('Authorization')
  );
}

export function GetLettersAPI() {
  return applyDecorators(
    ApiOperation({ summary: '내 편지함 조회 (편지 + 답장)', description: '선택한 날짜에(yyyy-MM-dd)에 해당하는 창문에 도착한 편지와 답장을 조회합니다.' }),
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
                  id: 1,
                  createdAt: "2023-10-24T17:38:02.317",
                  senderNickname: "삼번유저",
                  content: "안녕~~친구야~~~",
                  isBlocked: false,
                  imageUrl: "저장된 image URL"
              },
              {
                  id: 2,
                  createdAt: "2023-10-24T17:38:02.317",
                  senderNickname: "삼번유저",
                  content: "안녕~~친구야~~~",
                  isBlocked: false,
                  imageUrl: "저장된 image URL"
              },
              {
                  id: 3,
                  createdAt: "2023-10-24T17:38:02.317",
                  senderNickname: "삼번유저",
                  content: "안녕~~친구야~~~",
                  isBlocked: false,
                  imageUrl: "저장된 image URL"
              },
              {
                  id: 4,
                  createdAt: "2023-10-24T17:38:02.317",
                  senderNickname: "삼번유저",
                  content: "안녕~~친구야~~~",
                  isBlocked: false,
                  imageUrl: "저장된 image URL"
              },
              {
                  id: 5,
                  createdAt: "2023-10-24T17:38:02.317",
                  senderNickname: "삼번유저",
                  content: "안녕~~친구야~~~",
                  isBlocked: false,
                  imageUrl: "저장된 image URL"
              },
              {
                  id: 6,
                  createdAt: "2023-10-24T17:38:02.317",
                  senderNickname: "삼번유저",
                  content: "안녕~~친구야~~~",
                  isBlocked: false,
                  imageUrl: "저장된 image URL"
              },
              {
                  id: 7,
                  createdAt: "2023-10-24T17:38:02.317",
                  senderNickname: "삼번유저",
                  content: "안녕~~친구야~~~",
                  isBlocked: false,
                  imageUrl: "저장된 image URL"
              },
              {
                  id: 8,
                  createdAt: "2023-10-24T17:38:02.317",
                  senderNickname: "삼번유저",
                  content: "안녕~~친구야~~~",
                  isBlocked: false,
                  imageUrl: "저장된 image URL"
              },
              {
                  id: 9,
                  createdAt: "2023-10-24T17:38:02.317",
                  senderNickname: "삼번유저",
                  content: "안녕~~친구야~~~",
                  isBlocked: false,
                  imageUrl: "저장된 image URL"
              },
              {
                  id: 10,
                  createdAt: "2023-10-24T17:38:02.317",
                  senderNickname: "삼번유저",
                  content: "안녕~~친구야~~~",
                  isBlocked: false,
                  imageUrl: "저장된 image URL"
              }
          ],
          "replies": [
              {
                  id: 5,
                  createdAt: "2023-10-24T18:22:22.543",
                  content: "9번 편지에 3번 유저가 보내는 답장(4)",
                  isBlocked: false,
                  imageUrl: "저장된 image URL",
                  senderNickname: "삼번유저"
              },
              {
                  id: 4,
                  createdAt: "2023-10-24T17:38:53.183",
                  content: "9번 편지에 3번 유저가 보내는 답장(3)",
                  isBlocked: false,
                  imageUrl: "저장된 image URL",
                  senderNickname: "삼번유저"
              },
              {
                  id: 3,
                  createdAt: "2023-10-24T17:38:15.780",
                  content: "9번 편지에 3번 유저가 보내는 답장(2)",
                  isBlocked: false,
                  imageUrl: "저장된 image URL",
                  senderNickname: "삼번유저"
              },
              {
                  id: 2,
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
          success: false,
          error: '존재하지 않는 호텔 정보입니다. | 내 호텔의 편지만 확인할 수 있습니다. | 2023-12-01에 받은 편지가 존재하지 않습니다.'
        }
      }
    }),
    ApiBearerAuth('Authorization')
  );
}