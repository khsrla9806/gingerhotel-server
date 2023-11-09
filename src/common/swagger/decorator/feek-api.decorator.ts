import { applyDecorators } from "@nestjs/common";
import { ApiBadRequestResponse, ApiBearerAuth, ApiBody, ApiCreatedResponse, ApiHeader, ApiOkResponse, ApiOperation } from "@nestjs/swagger";
import { AcceptFeekRequest } from "src/feek/dto/accept-feek.dto";

export function RequestFeekAPI() {
  return applyDecorators(
    ApiOperation({ summary: '엿보기 요청', description: '사용자가 받았던 편지에 대해 엿보기 요청을 합니다.' }),
    ApiCreatedResponse({
      description: '엿보기 요청 성공 시',
      schema: {
        example: {
          success: true
        }
      }
    }),
    ApiBadRequestResponse({
      description: '엿보기 요청 실패 시',
      schema: {
        example: {
          success: false,
          error: '엿보기를 사용할 수 없는 멤버쉽 사용자입니다. | 사용할 수 있는 엿보기 개수가 없습니다. | 자신이 받은 편지만 엿보기 요청이 가능합니다.'
        }
      }
    }),
    ApiBearerAuth('Authorization')
  );
}

export function GetFeekDetailAPI() {
  return applyDecorators(
    ApiOperation({ summary: '엿보기 요청 상세 조회', description: '엿보기 요청에 대한 요청자 이름, 요청된 편지의 내용을 응답합니다.' }),
    ApiHeader({
      name: 'Notification',
      description: '알림 페이지에서 접근한 경우에 추가되는 notificationId (Ex. 1)',
      required: false
    }),
    ApiOkResponse({
      description: '상세 조회 성공 시',
      schema: {
        example: {
          success: true,
          feekId: 1,
          requestorName: '포터',
          letterSenderNickname: '헤르미온느',
          letterContent: '포터야 이번주에 영화보러 갈래?'
        }
      }
    }),
    ApiBadRequestResponse({
      description: '답장 생성에 실패했을 때',
      schema: {
        example: {
          success: false,
          error: '존재하지 않는 엿보기 요청 정보입니다. | 이미 수락/거절이 끝난 엿보기 요청 정보입니다. | 내가 보냈던 편지에 대한 엿보기만 조회가 가능합니다.'
        }
      }
    }),
    ApiBearerAuth('Authorization')
  );
}

export function AcceptFeekAPI() {
  return applyDecorators(
    ApiOperation({ summary: '엿보기 요청 수락', description: '엿보기 요청에 대한 응답을 작성하고, 수락합니다.' }),
    ApiBody({ description: '사용자가 엿보기 요청에 대한 답변을 작성합니다. (Required Member Token)', type: AcceptFeekRequest }),
    ApiCreatedResponse({
      description: '수락 성공 시',
      schema: {
        example: {
          success: true,
          requestorName: '헤르미온느',
          comment: '뒤에 앉은 사람'
        }
      }
    }),
    ApiBadRequestResponse({
      description: '수락 실패 시',
      schema: {
        example: {
          success: false,
          error: '존재하지 않는 편지 정보입니다. | 이미 수락/거절이 끝난 엿보기 요청 정보입니다. | 내가 보냈던 편지에 대한 엿보기만 조회가 가능합니다.'
        }
      }
    }),
    ApiBearerAuth('Authorization')
  );
}

export function RejectFeekAPI() {
  return applyDecorators(
    ApiOperation({ summary: '엿보기 요청 거절', description: '엿보기 요청을 거절합니다.' }),
    ApiCreatedResponse({
      description: '거절 성공 시',
      schema: {
        example: {
          success: true,
          requestorName: '헤르미온느'
        }
      }
    }),
    ApiBadRequestResponse({
      description: '거절 실패 시',
      schema: {
        example: {
          success: false,
          error: '존재하지 않는 편지 정보입니다. | 이미 수락/거절이 끝난 엿보기 요청 정보입니다. | 내가 보냈던 편지에 대한 엿보기만 조회가 가능합니다.'
        }
      }
    }),
    ApiBearerAuth('Authorization')
  );
}