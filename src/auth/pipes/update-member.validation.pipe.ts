import { LocalDate } from "@js-joda/core";
import { ArgumentMetadata, BadRequestException, PipeTransform } from "@nestjs/common";
import { Gender } from "src/entities/domain/gender.type";
import { UpdateMemberRequest } from "../dto/update-member.dto";

export class UpdateMemberValidationPipe implements PipeTransform {

  transform(value: any, metadata: ArgumentMetadata) {
      try {

        if (!value.gender && !value.birthDate) {
          throw new BadRequestException('성별, 생년월일 최소 1개의 데이터는 존재해야 합니다.');
        }
        
        let convertedGender = null;
        let convertedBirthDate: LocalDate = null;

        if (value.gender) {
          convertedGender = Gender[value.gender];

          if (!convertedGender) {
            throw new BadRequestException('잘못된 성별 데이터입니다. MAN | WOMAN');
          }
        }

        if (value.birthDate) {
          try {
            convertedBirthDate = LocalDate.parse(value.birthDate);
          } catch (e) {
            throw new BadRequestException('잘못된 날짜 형식입니다. Ex) yyyy-MM-dd');
          }
        }

        return new UpdateMemberRequest(convertedGender, convertedBirthDate);
        
      } catch (error) {
        throw new BadRequestException(error.message);
      }
  }
}