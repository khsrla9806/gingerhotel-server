import { LocalDate } from "@js-joda/core";
import { ArgumentMetadata, BadRequestException, PipeTransform } from "@nestjs/common";
import { HotelUpdateRequest } from "../dto/hotel-update.dto";
import { ErrorCode } from "src/common/filter/code/error-code.enum";

export class UpdateHotelValidationPipe implements PipeTransform {

  transform(value: any, metadata: ArgumentMetadata) {
      try {
        if (!value.structColor) {
          throw new Error('호텔 지붕 색상은 필수 값입니다.');
        }

        if (!value.bodyColor) {
          throw new Error('호텔 벽면 색상은 필수 값입니다.');
        }

        if (!value.nickname) {
          throw new Error('호텔 닉네임은 필수 값입니다.');
        }

        if (!value.description) {
          throw new Error('호텔 설명은 필수 값입니다.');
        }

        return new HotelUpdateRequest(value.structColor, value.bodyColor, value.nickname, value.description);
        
      } catch (error) {
        throw new BadRequestException(error.message, ErrorCode.ValidationFailed);
      }
  }
}