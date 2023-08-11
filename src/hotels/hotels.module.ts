/* eslint-disable */
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Hotel } from './entities/hotel.entity';
import { HotelResolver } from './hotels.resolover';
import { HotelService } from './hotels.service';

@Module({
  imports: [TypeOrmModule.forFeature([Hotel, ])],
  providers: [HotelResolver, HotelService],
})
export class HotelModule {}
