/* eslint-disable */
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HotelWindow } from '../entities/hotel-window.entity';
import { HotelWindowService } from './hotel.windows.service';
import { HotelWindowResolver } from './hotel.windows.resolover';


@Module({
  imports: [TypeOrmModule.forFeature([HotelWindow, ])],
  providers: [HotelWindowResolver, HotelWindowService],
})
export class HotelWindowModule {}
