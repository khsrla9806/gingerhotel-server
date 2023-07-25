import { Module } from '@nestjs/common';
import { GingerResolver } from './resolver';
import UserModule from 'src/modules/user/user.module';

@Module({
  imports: [UserModule],
  providers: [GingerResolver],
  exports: [UserModule],
})
export default class AppResolverModule {}
