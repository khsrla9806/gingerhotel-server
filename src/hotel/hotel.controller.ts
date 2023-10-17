import { Controller, Get, Param, ParseIntPipe, UseGuards, UseInterceptors } from '@nestjs/common';
import { HotelService } from './hotel.service';
import { LoginUser } from 'src/auth/decorator/login-user.decorator';
import { User } from 'src/entities/user.entity';
import { UserInterceptor } from 'src/auth/interceptor/user.interceptor';
import { ApiTags } from '@nestjs/swagger';
import { GetHotelAPI } from 'src/common/swagger/decorator/get-hotel.decorator';

@Controller('hotel')
@ApiTags('Hotel API')
export class HotelController {
  constructor(
    private readonly hotelService: HotelService
  ) {}

  @Get('/:hotelId')
  @UseInterceptors(UserInterceptor)
  @GetHotelAPI()
  async getHotel(
    @Param('hotelId', ParseIntPipe) hotelId: number,
    @LoginUser() user: User
  ) {
    return await this.hotelService.getHotel(hotelId, user);
  }
}
