import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from "@nestjs/common";
import { Observable } from "rxjs";
import { DataSource } from "typeorm";

@Injectable()
export class NotificationInterceptor implements NestInterceptor {
  constructor(
    private readonly dataSource: DataSource
  ) {}

  async intercept(context: ExecutionContext, next: CallHandler<any>): Promise<Observable<any>> {

    const request = context.switchToHttp().getRequest();
    
    const { notification } = request.headers;
    // Header에 Notification이 존재하지 않으면 아래 로직을 거치지 않음.
    if (!notification) {
      return next.handle();
    }

    const notificationId: number = +notification;
    const requestMemberId: number = request.user.id;

    const foundData = await this.dataSource.manager.query(
      `SELECT * FROM notification_history WHERE id=$1 and member_id=$2 LIMIT 1`,
      [notificationId, requestMemberId]
    );
    const notificationHistory = foundData[0];

    if (notificationHistory) {
      if (!notificationHistory.is_checked && notificationHistory.member_id === requestMemberId) {
        await this.dataSource.manager.query(
          'UPDATE notification_history SET is_checked = true WHERE id = $1', 
          [notificationHistory.id]
        );
      }
    }

    return next.handle();
  }
}