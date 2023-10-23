import { LocalDate } from "@js-joda/core";
import { ArgumentMetadata, BadRequestException, PipeTransform } from "@nestjs/common";
import { HotelUpdateRequest } from "../dto/hotel-update.dto";

export class UpdateHotelValidationPipe implements PipeTransform {

  transform(value: any, metadata: ArgumentMetadata) {
      try {
        if (!value.headColor) {
          throw new BadRequestException('호텔 지붕 색상은 필수 값입니다.');
        }

        if (!value.bodyColor) {
          throw new BadRequestException('호텔 벽면 색상은 필수 값입니다.');
        }

        if (!value.nickname) {
          throw new BadRequestException('호텔 닉네임은 필수 값입니다.');
        }

        if (!value.description) {
          throw new BadRequestException('호텔 설명은 필수 값입니다.');
        }

        return new HotelUpdateRequest(value.headColor, value.bodyColor, value.nickanme, value.description);
        
      } catch (error) {
        throw new BadRequestException(error.message);
      }
  }
}