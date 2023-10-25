import { LocalDateTime, nativeJs } from "@js-joda/core";
import { InternalServerErrorException } from "@nestjs/common";

export class LocalDateTimeConverter {
  public static convertCreatedAtToLocalDateTimeInList(list: any[]) {
    list.map((data) => { data.createdAt = this.convertDateToLocalDateTime(data.createdAt) });
  }

  public static convertDateToLocalDateTime(date: Date): LocalDateTime {
    try {
      return nativeJs(date).toLocalDateTime();
    } catch (e) {
      throw new InternalServerErrorException('[convertDateToLocalDateTime] 잘못된 Date 형태입니다.');
    }
  }
}