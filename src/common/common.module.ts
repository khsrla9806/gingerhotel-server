import { Module } from '@nestjs/common';
import { S3Service } from './utils/s3.service';
import { CommonController } from './controller/common.controller';
import { NotificationInterceptor } from './interceptor/notification.interceptor';

@Module({
  providers: [S3Service, NotificationInterceptor],
  exports: [S3Service, NotificationInterceptor],
  controllers: [CommonController]
})
export class CommonModule {}
