import { Module } from '@nestjs/common';
import { HotelController } from './hotel.controller';
import { HotelService } from './hotel.service';
import { AuthModule } from 'src/auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/entities/user.entity';
import { Hotel } from 'src/entities/hotel.entity';
import { Letter } from 'src/entities/letter.entity';
import { Reply } from 'src/entities/reply.entity';
import { HotelWindow } from 'src/entities/hotel-window.entity';

@Module({
  imports: [
    AuthModule,
    TypeOrmModule.forFeature([User, Hotel, Letter, Reply, HotelWindow])
  ],
  controllers: [HotelController],
  providers: [HotelService]
})
export class HotelModule {}
