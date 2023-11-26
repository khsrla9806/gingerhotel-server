import { applyDecorators } from "@nestjs/common";
import { ApiBadRequestResponse, ApiBearerAuth, ApiBody, ApiCreatedResponse, ApiOkResponse, ApiOperation, ApiQuery } from "@nestjs/swagger";
import { CreateHotelRequest } from "src/auth/dto/create-hotel.dto";
import { Vendor } from "src/entities/domain/vendor.type";

/**
 * 소셜 로그인 API DOCS 데코레이터
 */
export function SocialLoginAPI(vendor: Vendor ,type: any) {
  return applyDecorators(
    ApiBody({ description: `${vendor} 사용자 정보`, type: type }),
    ApiOperation({ summary: `${vendor} 소셜 로그인`, description: `${vendor} 소셜 로그인을 수행한다.` }),
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
          error: '유저의 호텔이 존재하지 않습니다. 호텔 생성을 완료해주세요. : member id',
          accessToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEyLCJpYXQiOjE2OTcxNzU1MDEsImV4cCI6MTY5NzE3OTEwMX0.0F5uArQIKcrUDaYtXkcUsUBgHXyJDXN3GMOZ6-YHFwE'
        }
      }
    })
  );
}

export function CreateHotelAPI() {
  return applyDecorators(
    ApiOperation({ summary: '호텔 생성', description: '사용자가 입력한 정보들로 호텔을 생성합니다.' }),
    ApiBody({ description: '사용자가 입력한 호텔, 사용자 정보 (Required Member Token)', type: CreateHotelRequest }),
    ApiCreatedResponse({
      description: '호텔 생성에 성공하면 hotelId를 반환한다.',
      schema: {
        example: {
          success: true,
          hotelId: 2
        }
      }
    }),
    ApiBearerAuth('Authorization')
  );
}

export function CheckMemberByCodeAPI() {
  return applyDecorators(
    ApiOperation({ summary: '사용자 코드로 사용자 확인하기', description: '사용자 입력한 코드에 해당하는 사용자가 있는지 확인합니다.' }),
    ApiOkResponse({
      description: '사용자 확인에 성공',
      schema: {
        example: {
          "success": true,
          "message": '친구 코드 확인 완료'
        }
      }
    }),
    ApiBadRequestResponse({
      description: '사용자 확인에 실패',
      schema: {
        example: {
          "success": false,
          "errorCode": '1002',
          "errorMessage": '에러 메시지'
        }
      }
    }),
    ApiBearerAuth('Authorization')
  );
}