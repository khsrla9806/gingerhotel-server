import { LocalDate } from "@js-joda/core";
import { ArgumentMetadata, BadRequestException, PipeTransform } from "@nestjs/common";

export class CreateHotelValidationPipe implements PipeTransform {

  transform(value: any, metadata: ArgumentMetadata) {
      try {
        if (value.birthDate) {
          const birthDate = value.birthDate as string;
          const parsedBirthDate = LocalDate.parse(birthDate);
          value.birthDate = parsedBirthDate;
        }

        return value;
        
      } catch (error) {
        throw new BadRequestException(`잘못된 날짜 형식입니다. (입력된 값 : ${value.birthDate})`);
      }
  }
}