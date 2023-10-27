import { Controller, Delete, Get, Param, ParseIntPipe, UseFilters, UseGuards } from '@nestjs/common';
import { NotificationsService } from '../service/notifications.service';
import { GlobalExceptionFilter } from 'src/common/filter/global-exception.filter';
import { AuthGuard } from '@nestjs/passport';
import { LoginMember } from 'src/auth/decorator/login-member.decorator';
import { Member } from 'src/entities/member.entity';

@UseFilters(GlobalExceptionFilter)
@Controller('notifications')
export class NotificationsController {
  constructor(
    private readonly notificationService: NotificationsService
  ) {}

  @Get('/my')
  @UseGuards(AuthGuard())
  async getNotifications(@LoginMember() loginMember: Member) {
    return await this.notificationService.getNotifications(loginMember);
  }

  @Delete('/:notificationId')
  @UseGuards(AuthGuard())
  async deleteNotification(
    @Param('notificationId', ParseIntPipe) notificationId: number,
    @LoginMember() loginMember: Member
  ) {
    return await this.notificationService.deleteNotification(notificationId, loginMember);
  }
}
