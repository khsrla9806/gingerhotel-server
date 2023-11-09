import { Global, Module } from '@nestjs/common';
import { S3Service } from './utils/s3.service';
import { CommonController } from './controller/common.controller';
import { NotificationInterceptor } from './interceptor/notification.interceptor';
import { GlobalExceptionFilter } from './filter/global-exception.filter';
import { APP_FILTER } from '@nestjs/core';

@Global()
@Module({
  providers: [
    S3Service,
    {
      provide: APP_FILTER,
      useClass: GlobalExceptionFilter
    }
  ],
  exports: [S3Service],
  controllers: [CommonController]
})
export class CommonModule {}
