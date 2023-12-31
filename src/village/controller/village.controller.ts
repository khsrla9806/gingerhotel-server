import { Controller, Delete, Get, Param, ParseIntPipe, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { LoginMember } from 'src/auth/decorator/login-member.decorator';
import { Member } from 'src/entities/member.entity';
import { VillageService } from '../service/village.service';
import { CreateVillageAPI, CreateVillageByCodeAPI, DeleteVillageAPI, GetVillagesAPI } from 'src/common/swagger/decorator/village-api.decorator';
import { ApiTags } from '@nestjs/swagger';
import { MemberCodeValidationPipe } from 'src/common/pipes/member-code.validation.pipe';


@Controller('villages')
@ApiTags('Village API')
export class VillageController {
  constructor(
    private readonly villageService: VillageService
  ) {}

  @Post('/hotel/:hotelId')
  @UseGuards(AuthGuard())
  @CreateVillageAPI()
  async createVillage(
    @Param('hotelId', ParseIntPipe) hotelId: number,
    @LoginMember() loginMember: Member
  ) {
    return await this.villageService.createVillage(hotelId, loginMember);
  }

  @Delete('/hotel/:hotelId')
  @UseGuards(AuthGuard())
  @DeleteVillageAPI()
  async deleteVilege(
    @Param('hotelId', ParseIntPipe) hotelId: number,
    @LoginMember() loginMember: Member
  ) {
    return await this.villageService.deleteVillage(hotelId, loginMember);
  }

  @Get('/my')
  @UseGuards(AuthGuard())
  @GetVillagesAPI()
  async getVillages(@LoginMember() loginMember: Member) {
    return await this.villageService.getVillages(loginMember);
  }

  @Post('/member/:code')
  @UseGuards(AuthGuard())
  @CreateVillageByCodeAPI()
  async createVillageByCode(
    @Param('code', MemberCodeValidationPipe) code: string,
    @LoginMember() loginMember: Member
  ) {
    return await this.villageService.createVillageByCode(code, loginMember);
  }
}
