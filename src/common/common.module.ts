import { Global, Module } from '@nestjs/common';
import { S3Service } from './utils/s3.service';

@Global()
@Module({
  providers: [S3Service],
  exports: [S3Service]
})
export class CommonModule {}
