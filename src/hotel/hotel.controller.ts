import { Body, Controller, Get, Param, ParseIntPipe, Patch, UseGuards, UseInterceptors } from '@nestjs/common';
import { HotelService } from './hotel.service';
import { LoginMember } from 'src/auth/decorator/login-member.decorator';
import { Member } from 'src/entities/member.entity';
import { MemberInterceptor } from 'src/auth/interceptor/member.interceptor';
import { ApiTags } from '@nestjs/swagger';
import { GetHotelAPI } from 'src/common/swagger/decorator/hotel-api.decorator';
import { AuthGuard } from '@nestjs/passport';
import { HotelUpdateRequest } from './dto/hotel-update.dto';
import { UpdateHotelValidationPipe } from './pipes/update-hotel.validation.pipe';

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
    @LoginMember() loginMember: Member
  ) {
    return await this.hotelService.getHotel(hotelId, loginMember);
  }

  @Patch('/:hotelId')
  @UseGuards(AuthGuard())
  async modifyHotel(
    @Param('hotelId', ParseIntPipe) hotelId: number,
    @Body(UpdateHotelValidationPipe) dto: HotelUpdateRequest,
    @LoginMember() loginMember: Member
  ) {
    return await this.hotelService.modifyHotel(hotelId, dto, loginMember);
  }
}
