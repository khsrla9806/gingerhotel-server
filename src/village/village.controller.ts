import { Controller, Delete, Param, ParseIntPipe, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { LoginUser } from 'src/auth/decorator/login-user.decorator';
import { User } from 'src/entities/user.entity';
import { VillageService } from './village.service';

@Controller('village')
export class VillageController {
  constructor(
    private readonly villageService: VillageService
  ) {}

  @Post('/hotel/:hotelId')
  @UseGuards(AuthGuard())
  async createVillage(
    @Param('hotelId', ParseIntPipe) hotelId: number,
    @LoginUser() loginUser: User
  ) {
    return await this.villageService.createVillage(hotelId, loginUser);
  }

  @Delete('/hotel/:hotelId')
  @UseGuards(AuthGuard())
  async deleteVilege(
    @Param('hotelId', ParseIntPipe) hotelId: number,
    @LoginUser() loginUser: User
  ) {
    return await this.villageService.deleteVillage(hotelId, loginUser);
  }
}
