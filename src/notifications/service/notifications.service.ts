import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Member } from 'src/entities/member.entity';
import { NotificationHistory } from 'src/entities/notification-history.entity';
import { Repository } from 'typeorm';
import { GetNotificationsResponse } from '../dto/get-notifications.dto';

@Injectable()
export class NotificationsService {
  constructor(
    @InjectRepository(NotificationHistory)
    private readonly notificationHistoryRepository: Repository<NotificationHistory>
  ) {}

  async getNotifications(loginMember: Member) {
    try {
      const notificationHistories: NotificationHistory[] = await this.notificationHistoryRepository
        .createQueryBuilder('notificationHistory')
        .innerJoin('notificationHistory.member', 'member', 'member.id = :memberId', { memberId: loginMember.id })
        .orderBy('notificationHistory.id', 'DESC')
        .getMany();

      const notificationResponse = notificationHistories.map((notificationHistory): GetNotificationsResponse => {
        return GetNotificationsResponse.from(notificationHistory);
      })

      return notificationResponse;
    } catch (error) {
      throw error;
    }
  }
}
