import { Controller, Get, Param, ParseIntPipe, UseGuards, UseInterceptors } from '@nestjs/common';
import { HotelService } from './hotel.service';
import { LoginUser } from 'src/auth/decorator/login-user.decorator';
import { User } from 'src/entities/user.entity';
import { UserInterceptor } from 'src/auth/interceptor/user.interceptor';

@Controller('hotel')
export class HotelController {
  constructor(
    private readonly hotelService: HotelService
  ) {}

  @Get('/:hotelId')
  @UseInterceptors(UserInterceptor)
  async getHotel(
    @Param('hotelId', ParseIntPipe) hotelId: number,
    @LoginUser() user: User
  ) {
    return await this.hotelService.getHotel(hotelId, user);
  }
}
