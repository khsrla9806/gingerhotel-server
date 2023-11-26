import { applyDecorators } from "@nestjs/common";
import { ApiBadRequestResponse, ApiBearerAuth, ApiBody, ApiOkResponse, ApiOperation } from "@nestjs/swagger";
import { UpdateMemberRequest } from "src/auth/dto/update-member.dto";

export function GetMemberInfoAPI() {
  return applyDecorators(
    ApiOperation({ summary: '마이페이지 데이터 조회', description: '요청한 사용자의 데이터를 반환합니다.' }),
    ApiOkResponse({
      description: '마이페이지 조회에 성공했을 때',
      schema: {
        example: {
          success: true,
          user: {
            nickname: '헤르미온느',
            code: 'cEH7UbQ',
            membership: 'DELUXE',
            gender: 'MAN | WOMAN | null',
            birthDate: '1998-06-13 | null',
            keyCount: 2,
            feekCount: 0
          },
          hotel: {
            id: 12,
            nickname: '헤르미온느',
            description: '헤르미온느의 호텔에 오신걸 환영합니다.',
            structColor: "#2E9AFE",
            bodyColor: "#2E9AFE"
          }
        }
      }
    }),
    ApiBadRequestResponse({
      description: '마이페이지 조회에 실패했을 때',
      schema: {
        example: {
          "success": false,
          "errorCode": '1001',
          "errorMessage": '에러 메시지'
        }
      }
    }),
    ApiBearerAuth('Authorization')
  );
}

export function UpdateMemberInfoAPI() {
  return applyDecorators(
    ApiOperation({ summary: '사용자 정보 수정', description: '요청한 사용자의 정보를 수정합니다.' }),
    ApiBody({ description: '변경할 성별, 생년월일을 입력합니다. (성별, 생년월일 둘다 Optional이지만, 반드시 1개는 존재해야 합니다.)', type: UpdateMemberRequest }),
    ApiOkResponse({
      description: '정보 수정에 성공했을 때',
      schema: {
        example: {
          success: true,
          userId: 2
        }
      }
    }),
    ApiBadRequestResponse({
      description: '정보 수정에 실패했을 때',
      schema: {
        example: {
          "success": false,
          "errorCode": '1001',
          "errorMessage": '에러 메시지'
        }
      }
    }),
    ApiBearerAuth('Authorization')
  );
}

export function DeleteMemberAPI() {
  return applyDecorators(
    ApiOperation({ summary: '회원 탈퇴', description: '회원 탈퇴를 진행합니다.' }),
    ApiOkResponse({
      description: '회원 탈퇴에 성공 했을 때',
      schema: {
        example: {
          success: true
        }
      }
    }),
    ApiBadRequestResponse({
      description: '회원 탈퇴에 실패했을 때',
      schema: {
        example: {
          "success": false,
          "errorCode": '1001',
          "errorMessage": '에러 메시지'
        }
      }
    }),
    ApiBearerAuth('Authorization')
  );
}