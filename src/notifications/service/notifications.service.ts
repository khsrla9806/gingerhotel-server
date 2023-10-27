import { BadRequestException, Injectable } from '@nestjs/common';
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

  /**
   * 내 알림 목록 조회
   */
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

  /**
   * 내 알림 삭제
   */
  async deleteNotification(notificationId: number, loginMember: Member) {
    try {
      const notification: NotificationHistory = await this.notificationHistoryRepository
        .createQueryBuilder('notification')
        .innerJoin('notification.member', 'member')
        .select(['notification', 'member.id'])
        .where('notification.id = :notificationId', { notificationId: notificationId })
        .getOne();

      if (!notification) {
        throw new BadRequestException('존재하지 않는 알림 정보입니다.');
      }

      if (notification.member.id !== loginMember.id) {
        throw new BadRequestException('내 알림만 삭제가 가능합니다.');
      }

      await this.notificationHistoryRepository.delete(notification.id);

      return {
        success: true
      }
    } catch (error) {
      throw error;
    }
  }
}
