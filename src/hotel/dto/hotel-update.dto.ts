import { ApiProperty } from "@nestjs/swagger";
import { Hotel } from "src/entities/hotel.entity";

export class HotelUpdateRequest {
  
  @ApiProperty({ description: '호텔 지붕 색상 코드', example: '#fffff' })
  private headColor: string;

  @ApiProperty({ description: '호텔 벽면 색상 코드', example: '#fffff' })
  private bodyColor: string;

  @ApiProperty({ description: '호텔 닉네임', example: '헤르미온느' })
  private nickname: string;

  @ApiProperty({ description: '호텔 설명', example: '헤르미온느의 호텔입니다. 편지 주세요.' })
  private description: string;

  constructor(
    headColor: string,
    bodyColor: string,
    nickname: string,
    description: string,
  ) {
    this.headColor = headColor;
    this.bodyColor = bodyColor;
    this.nickname = nickname;
    this.description = description;
  }

  getUpdatedHotel(hotel: Hotel): Hotel {
    hotel.headColor = this.headColor;
    hotel.bodyColor = this.bodyColor;
    hotel.nickname = this.nickname;
    hotel.description = this.description;

    return hotel;
  }
}