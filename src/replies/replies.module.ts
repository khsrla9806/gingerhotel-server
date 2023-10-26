import { Module } from '@nestjs/common';
import { RepliesController } from './controller/replies.controller';
import { RepliesService } from './service/replies.service';
import { AuthModule } from 'src/auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Hotel } from 'src/entities/hotel.entity';
import { HotelWindow } from 'src/entities/hotel-window.entity';
import { Member } from 'src/entities/member.entity';
import { Letter } from 'src/entities/letter.entity';
import { Reply } from 'src/entities/reply.entity';
import { MemberBlockHistory } from 'src/entities/member-block-history.entity';

@Module({
  imports: [
    AuthModule,
    TypeOrmModule.forFeature([Hotel, HotelWindow, Member, Letter, Reply, MemberBlockHistory])
  ],
  controllers: [RepliesController],
  providers: [RepliesService]
})
export class RepliesModule {}
