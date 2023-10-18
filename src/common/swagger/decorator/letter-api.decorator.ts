import { applyDecorators } from "@nestjs/common";
import { ApiBadRequestResponse, ApiBearerAuth, ApiBody, ApiConsumes, ApiCreatedResponse, ApiOkResponse, ApiOperation } from "@nestjs/swagger";
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