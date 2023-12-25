import { LocalDate } from "@js-joda/core";

export class LocalDateTimeUtils {
    public static isTargetDate(): boolean {
        const now: LocalDate = LocalDate.now();
        const targetDate: LocalDate = LocalDate.of(2023, 12, 25);

        return !now.isBefore(targetDate);
    }

    public static isAfterTargetDate(): boolean {
        const now: LocalDate = LocalDate.now();
        const targetDate: LocalDate = LocalDate.of(2023, 12, 25);

        return now.isAfter(targetDate);
    }
}