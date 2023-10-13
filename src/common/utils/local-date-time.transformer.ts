import { LocalDate, LocalDateTime, convert, nativeJs } from "@js-joda/core";
import { ValueTransformer } from "typeorm";

export class LocalDateTransformer implements ValueTransformer {
  // Entity에서 DB로 저장할 때
  to(entityValue: LocalDate): Date {
    if (entityValue) {
      return convert(entityValue).toDate();
    }

    return null;
  }

  // DB에서 Entity로 가져올 때
  from(databaseValue: Date): LocalDate {
    if (databaseValue) {
      return LocalDate.parse(databaseValue.toString());
    }

    return null;
  }
}

export class LocalDateTimeTransformer implements ValueTransformer {
  // Entity에서 DB로 저장할 때
  to(entityValue: LocalDateTime): Date {
    return convert(entityValue).toDate();
  }

  // DB에서 Entity로 가져올 때
  from(databaseValue: Date): LocalDateTime {
    return LocalDateTime.from(nativeJs(databaseValue));
  }
}