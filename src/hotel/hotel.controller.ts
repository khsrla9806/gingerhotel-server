import { Controller, Get, Param, ParseIntPipe, UseGuards, UseInterceptors } from '@nestjs/common';
import { HotelService } from './hotel.service';
import { LoginMember } from 'src/auth/decorator/login-member.decorator';
import { Member } from 'src/entities/member.entity';
import { MemberInterceptor } from 'src/auth/interceptor/member.interceptor';
import { ApiTags } from '@nestjs/swagger';
import { GetHotelAPI } from 'src/common/swagger/decorator/hotel-api.decorator';

@Controller('hotel')
@ApiTags('Hotel API')
export class HotelController {
  constructor(
    private readonly hotelService: HotelService
  ) {}

  @Get('/:hotelId')
  @UseInterceptors(MemberInterceptor)
  @GetHotelAPI()
  async getHotel(
    @Param('hotelId', ParseIntPipe) hotelId: number,
    @LoginMember() member: Member
  ) {
    return await this.hotelService.getHotel(hotelId, member);
  }
}
