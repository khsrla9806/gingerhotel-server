import { LocalDate } from "@js-joda/core";
import { ArgumentMetadata, BadRequestException, PipeTransform } from "@nestjs/common";
import { ErrorCode } from "src/common/filter/code/error-code.enum";
import { Gender } from "src/entities/domain/gender.type";
import { Background, BuildingDecorator, GardenDecorator, WindowDecorator } from "src/entities/domain/hotel-decorator.type";

export class CreateHotelValidationPipe implements PipeTransform {

  transform(value: any, metadata: ArgumentMetadata) {
      try {
        if (!value.structColor) {
          value.structColor = '#CF332C'; // 뼈대 색상 입력값 없으면 기본 설정 값으로
        }

        if (!value.bodyColor) {
          value.bodyColor = '#CF332C'; // 벽면 색상 입력값 없으면 기본 설정 값으로
        }

        const pattern = /^(#([\da-f]{1,2}){3})$/i;

        if (!pattern.test(value.structColor) || !pattern.test(value.bodyColor)) {
          throw new Error('잘못된 색상 코드 형태입니다.');
        }

        if (value.gender && !Gender[value.gender]) {
          value.gender = null; // 성별 입력 값 있는데, 이상한 값이면 null로 처리
        }

        if (value.birthDate) {
          try {
            const birthDate = value.birthDate as string;
            const parsedBirthDate = LocalDate.parse(birthDate);
            value.birthDate = parsedBirthDate;
          } catch (error) {
            value.birthDate = null; // 생년월일 잘못된 값이면 null로 처리
          }
        }

        if (!value.nickname) {
          throw new Error('닉네임은 필수값입니다.');
        }

        if (typeof value.nickname !== "string") {
          throw new Error('nickname must be string.')
        }
        value.nickname = value.nickname.trim();

        // 제한은 8자 최대로 두고, 9글자 정도까지 여유있게 서버에서 수정
        if (value.nickname.length > 9 || value.nickname.length < 1) {
          throw new Error('닉네임은 최대 8글자입니다.');
        }

        if (!value.description) {
          throw new Error('호텔 설명은 필수값입니다.');
        }
        if (typeof value.description !== "string") {
          throw new Error('nickname must be string.')
        }
        value.description = value.description.trim();

        // 제한은 25자 최대로 두고, 30글자 정도까지 여유있게 서버에서 수정
        if (value.description.length > 30 || value.description.length < 1) {
          throw new Error('호텔 설명은 최대 25글자입니다.');
        }

        // 호텔 데코
        if (!value.buildingDecorator || !BuildingDecorator[value.buildingDecorator]) {
          value.buildingDecorator = BuildingDecorator.buildingDeco01; // 건물 데코 없거나 잘못된 값이면 기본 값으로
        }

        if (!value.gardenDecorator || !GardenDecorator[value.gardenDecorator]) {
          value.gardenDecorator = GardenDecorator.gardenDeco01; // 마당 장식 없거나 잘못된 값이면 기본 값으로
        }

        if (!value.windowDecorator || !WindowDecorator[value.windowDecorator]) {
          value.windowDecorator = WindowDecorator.windowDeco01; // 창문 장식 없거나 잘못된 값이면 기본 값으로
        }

        if (!value.background || !Background[value.background]) {
          value.background = Background.background01; // 뒷 배경 없거나 잘못된 값이면 기본 값으로
        }

        return value;
        
      } catch (error) {
        throw new BadRequestException(error.message, ErrorCode.ValidationFailed);
      }
  }
}