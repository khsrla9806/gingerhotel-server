import { ApiProperty } from "@nestjs/swagger";
import { Background, BuildingDecorator, GardenDecorator, WindowDecorator } from "src/entities/domain/hotel-decorator.type";
import { Hotel } from "src/entities/hotel.entity";

export class HotelUpdateRequest {
  
  @ApiProperty({ description: '호텔 지붕 색상 코드', example: '#fffff' })
  private structColor: string;

  @ApiProperty({ description: '호텔 벽면 색상 코드', example: '#fffff' })
  private bodyColor: string;

  @ApiProperty({ description: '호텔 닉네임', example: '헤르미온느' })
  private nickname: string;

  @ApiProperty({ description: '호텔 설명', example: '헤르미온느의 호텔입니다. 편지 주세요.' })
  private description: string;

  @ApiProperty({ description: '건물 장식', example: 'buildingDeco01' })
  private buildingDecorator: BuildingDecorator;

  @ApiProperty({ description: '마당 장식', example: 'gardenDeco01' })
  private gardenDecorator: GardenDecorator;

  @ApiProperty({ description: '창문 장식', example: 'windowDeco01' })
  private windowDecorator: WindowDecorator;

  @ApiProperty({ description: '뒷배경', example: 'background01' })
  private background: Background;

  constructor(
    structColor: string,
    bodyColor: string,
    nickname: string,
    description: string,
    buildingDecorator: BuildingDecorator,
    gardenDecorator: GardenDecorator,
    windowDecorator: WindowDecorator,
    background: Background
  ) {
    this.structColor = structColor;
    this.bodyColor = bodyColor;
    this.nickname = nickname;
    this.description = description;
    this.buildingDecorator = buildingDecorator;
    this.gardenDecorator = gardenDecorator;
    this.windowDecorator = windowDecorator;
    this.background = background;
  }

  getUpdatedHotel(hotel: Hotel): Hotel {
    hotel.structColor = this.structColor;
    hotel.bodyColor = this.bodyColor;
    hotel.nickname = this.nickname;
    hotel.description = this.description;
    hotel.buildingDecorator = this.buildingDecorator;
    hotel.gardenDecorator = this.gardenDecorator;
    hotel.windowDecorator = this.windowDecorator;
    hotel.background = this.background;

    return hotel;
  }
}