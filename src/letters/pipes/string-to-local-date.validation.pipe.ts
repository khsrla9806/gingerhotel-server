import { LocalDate } from "@js-joda/core";
import { ArgumentMetadata, BadRequestException, InternalServerErrorException, PipeTransform } from "@nestjs/common";

export class StringToLocalDateValidationPipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {
      try {
        if (!value) {
          throw new BadRequestException('날짜는 필수 값입니다.');
        }
        
        try {
          return LocalDate.parse(value);
        } catch (e) {
          throw new BadRequestException(`잘못된 날짜 형태입니다. (yyyy-MM-dd) : ${value}`);
        }

      } catch (e) {
        if (e instanceof BadRequestException) {
          throw new BadRequestException({
            success: false,
            error: e.message
          });
        }

        throw new InternalServerErrorException({
          success: false,
          error: e.message
        });
      }
  }
}