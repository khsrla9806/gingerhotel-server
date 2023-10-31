import { Module } from '@nestjs/common';
import { LettersController } from './controller/letters.controller';
import { LettersService } from './service/letters.service';
import { AuthModule } from 'src/auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Hotel } from 'src/entities/hotel.entity';
import { HotelWindow } from 'src/entities/hotel-window.entity';
import { Letter } from 'src/entities/letter.entity';
import { Reply } from 'src/entities/reply.entity';
import { MemberBlockHistory } from 'src/entities/member-block-history.entity';
import { CommonModule } from 'src/common/common.module';

@Module({
  imports: [
    CommonModule,
    AuthModule,
    TypeOrmModule.forFeature([Hotel, HotelWindow, Letter, Reply, MemberBlockHistory])
  ],
  controllers: [LettersController],
  providers: [LettersService]
})
export class LettersModule {}
