import { nativeJs } from "@js-joda/core";

export class LocalDateTimeConverter {
  public static convertCreatedAtToLocalDateTimeInList(list: any) {
    list.map((data) => { data.createdAt = nativeJs(data.createdAt).toLocalDateTime() });
  }
}