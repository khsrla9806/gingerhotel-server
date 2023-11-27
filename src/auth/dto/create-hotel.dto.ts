import { LocalDate } from "@js-joda/core";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { CommonResponse } from "src/common/dto/output.dto";
import { Gender } from "src/entities/domain/gender.type";
import { Background, BuildingDecorator, GardenDecorator, WindowDecorator } from "src/entities/domain/hotel-decorator.type";

export class CreateHotelResponse extends CommonResponse {
  hotelId?: number;
}

export class CreateHotelRequest {
  @ApiProperty({ description: '호텔 지붕 색상', example: '#0E5E6F' })
  structColor: string;

  @ApiProperty({ description: '호텔 벽면 색상', example: '#AF2010' })
  bodyColor: string;

  @ApiProperty({ description: '닉네임', example: '헤르미온느' })
  nickname: string;

  @ApiProperty({ description: '호텔 설명', example: '제 호텔에 오신걸 환영합니다.' })
  description: string;

  @ApiProperty({ description: '건물 장식', example: 'buildingDeco01' })
  buildingDecorator: BuildingDecorator;

  @ApiProperty({ description: '마당 장식', example: 'gardenDeco01' })
  gardenDecorator: GardenDecorator;

  @ApiProperty({ description: '창문 장식', example: 'windowDeco01' })
  windowDecorator: WindowDecorator;

  @ApiProperty({ description: '뒷배경', example: 'background01' })
  background: Background;

  @ApiPropertyOptional({ description: '사용자 성별', example: 'MAN | WOMAN' })
  gender?: Gender;

  @ApiPropertyOptional({ description: '사용자 생년월일 (Ex) "1998-06-13"', type: 'LocalDate', example: '1998-06-13' })
  birthDate?: LocalDate;

  @ApiPropertyOptional({ description: '친구 추천 코드 (7자리)', example: 'dkfjw4p' })
  code?: string;
}