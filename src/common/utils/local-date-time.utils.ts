import { LocalDate } from "@js-joda/core";

export class LocalDateTimeUtils {
    public static isTargetDate(): boolean {
        const now: LocalDate = LocalDate.now();
        const targetDate: LocalDate = LocalDate.of(2023, 12, 25); // 크리스마스 (임시 테스트 15일)

        return !now.isBefore(targetDate);
    }
}