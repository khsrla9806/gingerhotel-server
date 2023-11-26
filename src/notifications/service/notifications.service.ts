import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Member } from 'src/entities/member.entity';
import { NotificationHistory } from 'src/entities/notification-history.entity';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { GetNotificationsResponse } from '../dto/get-notifications.dto';
import { CursorPageOptionDTO } from '../../common/dto/cursor-page-option.dto';
import { Order } from '../../common/dto/cursor-page-order.enum';
import { CursorPageMetaDTO } from 'src/common/dto/cursor-page-meta.dto';
import { CursorPageDTO } from 'src/common/dto/cursor-page.dto';
import { CreateDeviceRequestDTO } from '../dto/create-device.dto';
import { Device } from 'src/entities/device.entity';
import { CommonResponse } from 'src/common/dto/output.dto';
import { ErrorCode } from 'src/common/filter/code/error-code.enum';

@Injectable()
export class NotificationsService {
  constructor(
    @InjectRepository(NotificationHistory)
    private readonly notificationHistoryRepository: Repository<NotificationHistory>,
    @InjectRepository(Device)
    private readonly deviceRepository: Repository<Device>
  ) {}

  /**
   * 내 알림 목록 조회
   */
  async getNotifications(
    loginMember: Member, { sort, size, cursorId }: CursorPageOptionDTO): Promise<CursorPageDTO<GetNotificationsResponse>> {
    try {

      const total = await this.notificationHistoryRepository
        .createQueryBuilder('notificationHistory')
        .where('notificationHistory.member.id = :memberId', { memberId: loginMember.id })
        .getCount();
      
      const notificationHistoriesQueryBuilder: SelectQueryBuilder<NotificationHistory> = this.notificationHistoryRepository
        .createQueryBuilder('notificationHistory')
        .innerJoin('notificationHistory.member', 'member', 'member.id = :memberId', { memberId: loginMember.id });
      
      if (cursorId) {
        notificationHistoriesQueryBuilder.where('notificationHistory.id < :cursorId', { cursorId: cursorId });
      }

      const notificationHistories: NotificationHistory[] = await notificationHistoriesQueryBuilder
        .orderBy('notificationHistory.id', sort === Order.DESC ? 'DESC' : 'ASC')
        .limit(size)
        .getMany();

      const notificationResponse: GetNotificationsResponse[] = notificationHistories
        .map((notificationHistory): GetNotificationsResponse => {
          return GetNotificationsResponse.from(notificationHistory);
        });

      const isLastPage: boolean = total <= size;
      let hasNexPage: boolean = true;
      let cursor: number;

      if (isLastPage || notificationResponse.length < size) {
        hasNexPage = false;
        cursor = null;
      } else {
        cursor = notificationResponse[notificationResponse.length - 1].getId();
      }

      const cursorPageMetaDTO: CursorPageMetaDTO = new CursorPageMetaDTO(total, size, hasNexPage, cursor);

      return new CursorPageDTO(notificationResponse, cursorPageMetaDTO);
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
        throw new BadRequestException('존재하지 않는 알림 정보입니다.', ErrorCode.NotFoundResource);
      }

      if (notification.member.id !== loginMember.id) {
        throw new BadRequestException('내 알림만 삭제가 가능합니다.', ErrorCode.AccessDenied);
      }

      await this.notificationHistoryRepository.delete(notification.id);

      return {
        success: true
      }
    } catch (error) {
      throw error;
    }
  }

  /**
   * 사용자의 디바이스 등록
   */
  async createDevice(loginMember: Member, createDeviceRequest: CreateDeviceRequestDTO): Promise<CommonResponse> {
    try {
      const token: string = createDeviceRequest.getToken();

      const isExistDevice: boolean = await this.deviceRepository
        .createQueryBuilder('device')
        .where('device.member.id = :memberId and device.token = :token', { memberId: loginMember.id, token: token })
        .getExists();

      if (isExistDevice) {
        throw new BadRequestException('이미 등록된 디바이스 정보입니다.', ErrorCode.AlreadyRegisterDevice);
      }

      const device: Device = this.deviceRepository.create({
        member: loginMember,
        token: createDeviceRequest.getToken(),
        status: createDeviceRequest.getStatus()
      });

      await this.deviceRepository.save(device);

      return {
        success: true
      }

    } catch (error) {
      throw error;
    }
  }
}
