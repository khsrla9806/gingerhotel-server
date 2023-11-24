import { BadRequestException, Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Query, UseGuards } from '@nestjs/common';
import { NotificationsService } from '../service/notifications.service';
import { AuthGuard } from '@nestjs/passport';
import { LoginMember } from 'src/auth/decorator/login-member.decorator';
import { Member } from 'src/entities/member.entity';
import { ApiTags } from '@nestjs/swagger';
import { CreateDeviceAPI, DeleteNotificationAPI, GetNotificationsAPI } from 'src/common/swagger/decorator/notification-api.decorator';
import { CursorPageOptionDTO } from '../../common/dto/cursor-page-option.dto';
import { CreateDeviceRequestDTO } from '../dto/create-device.dto';


@Controller('notifications')
@ApiTags('Notification API')
export class NotificationsController {
  constructor(
    private readonly notificationService: NotificationsService
  ) {}

  @Get('/my')
  @UseGuards(AuthGuard())
  @GetNotificationsAPI()
  async getNotifications(
    @LoginMember() loginMember: Member,
    @Query() cursorPageOption: CursorPageOptionDTO
  ) {
    return await this.notificationService.getNotifications(loginMember, cursorPageOption);
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

  @Post('/device')
  @UseGuards(AuthGuard())
  @CreateDeviceAPI()
  async createDevice(
    @LoginMember() loginMember: Member, 
    @Body() createDeviceRequest: CreateDeviceRequestDTO
  ) {
    return await this.notificationService.createDevice(loginMember, createDeviceRequest);
  }
}
