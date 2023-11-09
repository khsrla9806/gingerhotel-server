import { Module } from '@nestjs/common';
import { NotificationsController } from './controller/notifications.controller';
import { NotificationsService } from './service/notifications.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NotificationHistory } from 'src/entities/notification-history.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([NotificationHistory])
  ],
  controllers: [NotificationsController],
  providers: [NotificationsService]
})
export class NotificationsModule {
  constructor() {}
}
