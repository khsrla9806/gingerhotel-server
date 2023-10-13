import { applyDecorators } from "@nestjs/common";
import { ApiBearerAuth, ApiBody, ApiCreatedResponse, ApiOperation } from "@nestjs/swagger";
import { CreateHotelRequest } from "src/auth/dto/create-hotel.dto";

export function CreateHotelAPI() {
  return applyDecorators(
    ApiOperation({ summary: 'Create Hotel API', description: '사용자가 입력한 정보들로 호텔을 생성합니다.' }),
    ApiBody({ description: '사용자가 입력한 호텔, 사용자 정보 (Required User Token)', type: CreateHotelRequest }),
    ApiCreatedResponse({
      description: '호텔 생성에 성공하면 hotelId를 반환한다.',
      schema: {
        example: {
          success: true,
          hotelId: 2
        }
      }
    }),
    ApiBearerAuth('accessToken')
  );
}