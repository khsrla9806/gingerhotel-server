import { Controller, Module } from '@nestjs/common';
import { S3Service } from './utils/s3.service';
import { CommonController } from './controller/common.controller';

@Module({
  providers: [S3Service],
  exports: [S3Service],
  controllers: [CommonController]
})
export class CommonModule {}
