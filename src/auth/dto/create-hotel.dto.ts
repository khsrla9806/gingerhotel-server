import { LocalDate } from "@js-joda/core";
import { CommonResponse } from "src/common/dto/output.dto";
import { Gender } from "src/entities/domain/gender.type";

export class CreateHotelResponse extends CommonResponse {
  hotelId?: number;
}

export class CreateHotelRequest {
  headColor: string;
  bodyColor: string;
  nickname: string;
  description: string;
  gender?: Gender;
  birthDate?: LocalDate;
  code?: string;
}