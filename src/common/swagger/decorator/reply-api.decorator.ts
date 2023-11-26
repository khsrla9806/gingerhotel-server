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
          "success": false,
          "errorCode": '1003',
          "errorMessage": '에러 메시지'
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
          "success": false,
          "errorCode": '1003',
          "errorMessage": '에러 메시지'
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
          "success": false,
          "errorCode": '1003',
          "errorMessage": '에러 메시지'
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
          "success": false,
          "errorCode": '1003',
          "errorMessage": '에러 메시지'
        }
      }
    }),
    ApiBearerAuth('Authorization')
  );
}