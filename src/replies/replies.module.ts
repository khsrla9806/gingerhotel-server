import { Module } from '@nestjs/common';
import { RepliesController } from './replies.controller';
import { RepliesService } from './replies.service';
import { AuthModule } from 'src/auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Hotel } from 'src/entities/hotel.entity';
import { HotelWindow } from 'src/entities/hotel-window.entity';
import { User } from 'src/entities/user.entity';
import { Letter } from 'src/entities/letter.entity';
import { Reply } from 'src/entities/reply.entity';

@Module({
  imports: [
    AuthModule,
    TypeOrmModule.forFeature([Hotel, HotelWindow, User, Letter, Reply])
  ],
  controllers: [RepliesController],
  providers: [RepliesService]
})
export class RepliesModule {}
