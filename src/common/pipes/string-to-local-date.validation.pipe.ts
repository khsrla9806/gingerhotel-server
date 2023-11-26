import { LocalDate } from "@js-joda/core";
import { ArgumentMetadata, BadRequestException, InternalServerErrorException, PipeTransform } from "@nestjs/common";
import { ErrorCode } from "../filter/code/error-code.enum";

export class StringToLocalDateValidationPipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {
      try {
        if (!value) {
          throw new Error('날짜는 필수 값입니다.');
        }
        
        try {
          return LocalDate.parse(value);
        } catch (error) {
          throw new Error(`잘못된 날짜 형태입니다. (yyyy-MM-dd) : ${value}`);
        }

      } catch (error) {
        throw new BadRequestException(error.message, ErrorCode.ValidationFailed);
      }
  }
}