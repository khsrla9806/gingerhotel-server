import { LocalDate } from "@js-joda/core";
import { ArgumentMetadata, BadRequestException, PipeTransform } from "@nestjs/common";
import { ErrorCode } from "src/common/filter/code/error-code.enum";

export class CreateHotelValidationPipe implements PipeTransform {

  transform(value: any, metadata: ArgumentMetadata) {
      try {
        if (value.birthDate) {
          try {
            const birthDate = value.birthDate as string;
            const parsedBirthDate = LocalDate.parse(birthDate);
            value.birthDate = parsedBirthDate;
          } catch (error) {
            throw new Error(`잘못된 날짜 형식입니다. (input : ${value.birthDate})`);
          }
        }

        if (!value.nickname) {
          throw new Error('닉네임은 필수값입니다.');
        }

        if (typeof value.nickname !== "string") {
          throw new Error('nickname must be string.')
        }
        value.nickanme = value.nickname.trim();

        if (value.nickname.length > 7) {
          throw new Error('닉네임은 최대 7글자입니다.');
        }

        if (!value.description) {
          throw new Error('호텔 설명은 필수값입니다.');
        }
        if (typeof value.description !== "string") {
          throw new Error('nickname must be string.')
        }
        value.description = value.description.trim();

        if (value.description.length > 25) {
          throw new Error('호텔 설명은 최대 25글자입니다.');
        }

        return value;
        
      } catch (error) {
        throw new BadRequestException(error.message, ErrorCode.ValidationFailed);
      }
  }
}