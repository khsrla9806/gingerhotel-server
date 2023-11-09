import { Body, Controller, Get, Param, ParseIntPipe, Patch, Post, Query, UseGuards, UseInterceptors } from '@nestjs/common';
import { HotelService } from '../service/hotel.service';
import { LoginMember } from 'src/auth/decorator/login-member.decorator';
import { Member } from 'src/entities/member.entity';
import { MemberInterceptor } from 'src/auth/interceptor/member.interceptor';
import { ApiTags } from '@nestjs/swagger';
import { GetHotelAPI, OpenWindowAPI, UpdateHotelAPI } from 'src/common/swagger/decorator/hotel-api.decorator';
import { AuthGuard } from '@nestjs/passport';
import { HotelUpdateRequest } from '../dto/hotel-update.dto';
import { UpdateHotelValidationPipe } from '../pipes/update-hotel.validation.pipe';
import { LocalDate } from '@js-joda/core';
import { StringToLocalDateValidationPipe } from 'src/common/pipes/string-to-local-date.validation.pipe';


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
  @UpdateHotelAPI()
  async updateHotel(
    @Param('hotelId', ParseIntPipe) hotelId: number,
    @Body(UpdateHotelValidationPipe) dto: HotelUpdateRequest,
    @LoginMember() loginMember: Member
  ) {
    return await this.hotelService.updateHotel(hotelId, dto, loginMember);
  }

  @Post('/:hotelId/open/window')
  @UseGuards(AuthGuard())
  @OpenWindowAPI()
  async openWindow(
    @Param('hotelId', ParseIntPipe) hotelId: number,
    @Query('date', StringToLocalDateValidationPipe) date: LocalDate,
    @LoginMember() loginMember: Member
  ) {
    return await this.hotelService.openWindow(hotelId, date, loginMember);
  }
}
