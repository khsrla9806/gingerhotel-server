import { LocalDateTime } from "@js-joda/core";
import { LocalDateTimeConverter } from "src/common/utils/local-date-time.converter";
import { NotificationType } from "src/entities/domain/notification.type";
import { NotificationHistory } from "src/entities/notification-history.entity";

export class GetNotificationsResponse {
  private constructor(
    private id: number,
    private createdAt: LocalDateTime,
    private type: NotificationType,
    private typeData: object,
    private message: string,
    private isChecked: boolean
  ) {}

  public static from(notificationHistory: NotificationHistory): GetNotificationsResponse {
    return new GetNotificationsResponse(
      notificationHistory.id,
      LocalDateTimeConverter.convertDateToLocalDateTime(notificationHistory.createdAt),
      notificationHistory.type,
      JSON.parse(notificationHistory.typeData),
      notificationHistory.message,
      notificationHistory.isChecked
    );
  }
}