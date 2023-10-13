import { applyDecorators } from "@nestjs/common";
import { ApiBody, ApiCreatedResponse, ApiOkResponse, ApiOperation, ApiResponse } from "@nestjs/swagger";
import { Vendor } from "src/entities/domain/vendor.type";

/**
 * 소셜 로그인 API DOCS 데코레이터
 */
export function SocialLoginAPI(vendor: Vendor ,type: any) {
  return applyDecorators(
    ApiBody({ description: `${vendor} 사용자 정보`, type: type }),
    ApiOperation({ summary: `${vendor} Social Login`, description: `${vendor} 소셜 로그인을 수행한다.` }),
    ApiCreatedResponse({
      description: '로그인이 성공하면 토큰 정보를 반환한다.',
      schema: {
        example: {
          success: true,
          accessToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEyLCJpYXQiOjE2OTcxNzU1MDEsImV4cCI6MTY5NzE3OTEwMX0.0F5uArQIKcrUDaYtXkcUsUBgHXyJDXN3GMOZ6-YHFwE'
        }
      }
    }),
    ApiOkResponse({
      description: '로그인은 성공했는데, 소유한 호텔이 없는 경우',
      schema: {
        example: {
          success: false,
          error: '유저의 호텔이 존재하지 않습니다. 호텔 생성을 완료해주세요. : user id',
          accessToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEyLCJpYXQiOjE2OTcxNzU1MDEsImV4cCI6MTY5NzE3OTEwMX0.0F5uArQIKcrUDaYtXkcUsUBgHXyJDXN3GMOZ6-YHFwE'
        }
      }
    })
  );
}