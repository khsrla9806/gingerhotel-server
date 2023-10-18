import { applyDecorators } from "@nestjs/common";
import { ApiBadRequestResponse, ApiBearerAuth, ApiBody, ApiConsumes, ApiCreatedResponse, ApiOkResponse, ApiOperation } from "@nestjs/swagger";
import { CreateReplyRequest } from "src/replies/dto/create-reply.dto";

export function CreateReplyAPI() {
  return applyDecorators(
    ApiOperation({ summary: '답장 쓰기', description: '사용자가 입력한 답장 정보로 답장을 생성합니다.' }),
    ApiBody({ description: '사용자가 입력한 답장 정보 + 이미지 파일(Optional) (Required Member Token)', type: CreateReplyRequest }),
    ApiCreatedResponse({
      description: '답장 생성에 성공했을 때',
      schema: {
        example: {
          success: true
        }
      }
    }),
    ApiBadRequestResponse({
      description: '답장 생성에 실패했을 때',
      schema: {
        example: {
          success: false,
          error: '존재하지 않는 편지 정보입니다. | 삭제된 편지 정보입니다. | 수신자가 하루에 받을 수 있는 개수를 넘어섰습니다.'
        }
      }
    }),
    ApiBearerAuth('Authorization'),
    ApiConsumes('multipart/form-data')
  );
}

export function DeleteReplyAPI() {
  return applyDecorators(
    ApiOperation({ summary: '답장 삭제', description: '사용자가 답장을 삭제합니다.' }),
    ApiOkResponse({
      description: '답장 삭제 성공',
      schema: {
        example: {
          success: true
        }
      }
    }),
    ApiBadRequestResponse({
      description: '답장 삭제 실패',
      schema: {
        example: {
          success: false,
          error: '존재하지 않는 답장 정보입니다. | 자신이 받은 답장만 삭제할 수 있습니다.'
        }
      }
    }),
    ApiBearerAuth('Authorization')
  );
}

export function BlockReplyAPI() {
  return applyDecorators(
    ApiOperation({ summary: '답장 차단', description: '사용자가 답장를 보낸 사람을 차단합니다.' }),
    ApiOkResponse({
      description: '답장 차단 성공',
      schema: {
        example: {
          success: true
        }
      }
    }),
    ApiBadRequestResponse({
      description: '답장 차단 실패',
      schema: {
        example: {
          success: false,
          error: '존재하지 않는 답장 정보입니다. | 내가 받은 답장만 차단할 수 있습니다. | 이미 차단된 답장입니다.'
        }
      }
    }),
    ApiBearerAuth('Authorization')
  );
}

export function UnblockReplyAPI() {
  return applyDecorators(
    ApiOperation({ summary: '답장 차단 해제', description: '사용자가 차단된 답장를 차단 해제합니다.' }),
    ApiOkResponse({
      description: '답장 차단 해제 성공',
      schema: {
        example: {
          success: true
        }
      }
    }),
    ApiBadRequestResponse({
      description: '답장 차단 해제 실패',
      schema: {
        example: {
          success: false,
          error: '존재하지 않는 답장 정보입니다. | 내가 받은 답장만 차단 해제할 수 있습니다. | 차단 되어 있지 않은 답장입니다.'
        }
      }
    }),
    ApiBearerAuth('Authorization')
  );
}