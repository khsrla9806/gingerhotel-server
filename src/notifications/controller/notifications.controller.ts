import { Controller, Delete, Get, Param, ParseIntPipe, UseFilters, UseGuards } from '@nestjs/common';
import { NotificationsService } from '../service/notifications.service';
import { GlobalExceptionFilter } from 'src/common/filter/global-exception.filter';
import { AuthGuard } from '@nestjs/passport';
import { LoginMember } from 'src/auth/decorator/login-member.decorator';
import { Member } from 'src/entities/member.entity';
import { ApiTags } from '@nestjs/swagger';
import { DeleteNotificationAPI, GetNotificationsAPI } from 'src/common/swagger/decorator/notification-api.decorator';

@UseFilters(GlobalExceptionFilter)
@Controller('notifications')
@ApiTags('Notification API')
export class NotificationsController {
  constructor(
    private readonly notificationService: NotificationsService
  ) {}

  @Get('/my')
  @UseGuards(AuthGuard())
  @GetNotificationsAPI()
  async getNotifications(@LoginMember() loginMember: Member) {
    return await this.notificationService.getNotifications(loginMember);
  }

  @Delete('/:notificationId')
  @UseGuards(AuthGuard())
  @DeleteNotificationAPI()
  async deleteNotification(
    @Param('notificationId', ParseIntPipe) notificationId: number,
    @LoginMember() loginMember: Member
  ) {
    return await this.notificationService.deleteNotification(notificationId, loginMember);
  }
}
