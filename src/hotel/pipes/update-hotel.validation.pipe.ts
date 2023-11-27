import { LocalDate } from "@js-joda/core";
import { ArgumentMetadata, BadRequestException, PipeTransform } from "@nestjs/common";
import { HotelUpdateRequest } from "../dto/hotel-update.dto";
import { ErrorCode } from "src/common/filter/code/error-code.enum";
import { Background, BuildingDecorator, GardenDecorator, WindowDecorator } from "src/entities/domain/hotel-decorator.type";

export class UpdateHotelValidationPipe implements PipeTransform {

  transform(value: any, metadata: ArgumentMetadata) {
      try {
        // 호텔 색상
        if (!value.structColor) {
          throw new Error('호텔 지붕 색상은 필수 값입니다.');
        }

        if (!value.bodyColor) {
          throw new Error('호텔 벽면 색상은 필수 값입니다.');
        }

        const pattern = /^(#([\da-f]{1,2}){3})$/i;

        if (!pattern.test(value.structColor) || !pattern.test(value.bodyColor)) {
          throw new Error('잘못된 색상 코드 형태입니다.');
        }

        // 호텔 닉네임
        if (!value.nickname) {
          throw new Error('닉네임은 필수값입니다.');
        }
        if (typeof value.nickname !== "string") {
          throw new Error('nickname must be string.')
        }
        value.nickname = value.nickname.trim();
        if (value.nickname.length > 7 || value.nickname.length < 1) {
          throw new Error('닉네임은 최대 7글자입니다.');
        }

        // 호텔 설명
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

        // 호텔 데코
        if (!value.buildingDecorator) {
          throw new Error('건물 장식은 필수 값입니다.');
        }
        if (!BuildingDecorator[value.buildingDecorator]) {
          throw new Error('잘못된 건물 장식 선택지입니다.');
        }

        if (!value.gardenDecorator) {
          throw new Error('마당 장식은 필수 값입니다.');
        }
        if (!GardenDecorator[value.gardenDecorator]) {
          throw new Error('잘못된 마당 장식 선택지입니다.');
        }

        if (!value.windowDecorator) {
          throw new Error('창문 장식은 필수 값입니다.');
        }
        if (!WindowDecorator[value.windowDecorator]) {
          throw new Error('잘못된 창문 장식 선택지입니다.');
        }

        if (!value.background) {
          throw new Error('뒷배경은 필수 값입니다.');
        }
        if (!Background[value.background]) {
          throw new Error('잘못된 뒷배경 선택지입니다.');
        }

        return new HotelUpdateRequest(
          value.structColor, 
          value.bodyColor, 
          value.nickname, 
          value.description, 
          value.buildingDecorator, 
          value.gardenDecorator, 
          value.windowDecorator, 
          value.background
        );
        
      } catch (error) {
        throw new BadRequestException(error.message, ErrorCode.ValidationFailed);
      }
  }
}