import { Module } from '@nestjs/common';
import { HotelController } from './hotel.controller';
import { HotelService } from './hotel.service';
import { AuthModule } from 'src/auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Member } from 'src/entities/member.entity';
import { Hotel } from 'src/entities/hotel.entity';
import { Letter } from 'src/entities/letter.entity';
import { Reply } from 'src/entities/reply.entity';
import { HotelWindow } from 'src/entities/hotel-window.entity';
import { Village } from 'src/entities/village.entity';

@Module({
  imports: [
    AuthModule,
    TypeOrmModule.forFeature([Member, Hotel, Letter, Reply, HotelWindow, Village])
  ],
  controllers: [HotelController],
  providers: [HotelService]
})
export class HotelModule {}
