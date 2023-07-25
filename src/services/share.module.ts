import { Module } from '@nestjs/common';
import { UserService } from 'src/modules/user/user.service';
@Module({
  imports: [],
  exports: [UserService],
  providers: [UserService],
})
export class ShareModule {}
