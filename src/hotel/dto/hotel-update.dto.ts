import { Hotel } from "src/entities/hotel.entity";

export class HotelUpdateRequest {
  constructor(
    private headColor: string,
    private bodyColor: string,
    private nickname: string,
    private description: string,
  ) {}

  getUpdatedHotel(hotel: Hotel): Hotel {
    hotel.headColor = this.headColor;
    hotel.bodyColor = this.bodyColor;
    hotel.nickname = this.nickname;
    hotel.description = this.description;

    return hotel;
  }
}