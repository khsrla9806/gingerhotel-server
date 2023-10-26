import { Body, Controller, Get, Param, ParseIntPipe, Post, UseFilters, UseGuards } from '@nestjs/common';
import { FeekService } from '../service/feek.service';
import { AuthGuard } from '@nestjs/passport';
import { LoginMember } from 'src/auth/decorator/login-member.decorator';
import { Member } from 'src/entities/member.entity';
import { AcceptFeekRequest } from '../dto/accept-feek.dto';
import { ApiTags } from '@nestjs/swagger';
import { AcceptFeekAPI, GetFeekDetailAPI, RejectFeekAPI, RequestFeekAPI } from 'src/common/swagger/decorator/feek-api.decorator';
import { GlobalExceptionFilter } from 'src/common/filter/global-exception.filter';

@UseFilters(GlobalExceptionFilter)
@Controller('feek')
@ApiTags('Feek API')
export class FeekController {
  constructor(
    private readonly feekService: FeekService
  ) {}

  @Post('/letter/:letterId')
  @UseGuards(AuthGuard())
  @RequestFeekAPI()
  async requestFeek(
    @Param('letterId', ParseIntPipe) letterId: number,
    @LoginMember() loginMember: Member
  ) {
    return await this.feekService.requestFeek(letterId, loginMember);
  }

  @Get('/:feekId')
  @UseGuards(AuthGuard())
  @GetFeekDetailAPI()
  async getFeekDetail(
    @Param('feekId', ParseIntPipe) feekId: number,
    @LoginMember() loginMember: Member
  ) {
    return await this.feekService.getFeekDetail(feekId, loginMember);
  }

  @Post('/:feekId/accept')
  @UseGuards(AuthGuard())
  @AcceptFeekAPI()
  async acceptFeek(
    @Param('feekId', ParseIntPipe) feekId: number,
    @LoginMember() loginMember: Member,
    @Body() dto: AcceptFeekRequest
  ) {
    return await this.feekService.acceptFeek(feekId, loginMember, dto);
  }

  @Post('/:feekId/reject')
  @UseGuards(AuthGuard())
  @RejectFeekAPI()
  async rejectFeek(
    @Param('feekId', ParseIntPipe) feekId: number,
    @LoginMember() loginMember: Member
  ) {
    return await this.feekService.rejectFeek(feekId, loginMember);
  }
}
