import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { UserController } from './user.controller';
import { ShareModule } from 'src/services/share.module';

@Module({
  imports: [ShareModule],
  exports: [UserController],
  providers: [UserController],
})
export default class UserModule {}
