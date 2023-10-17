import { applyDecorators } from "@nestjs/common";
import { ApiBadRequestResponse, ApiBearerAuth, ApiBody, ApiConsumes, ApiCreatedResponse, ApiOperation } from "@nestjs/swagger";
import { CreateLetterRequest } from "src/letters/dto/create-letter.dto";

export function CreateLetterAPI() {
  return applyDecorators(
    ApiOperation({ summary: '편지 쓰기', description: '사용자가 입력한 편지 정보로 편지를 생성합니다.' }),
    ApiBody({ description: '사용자가 입력한 편지 정보 + 이미지 파일(Optional) (Required User Token)', type: CreateLetterRequest }),
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