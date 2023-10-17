import { Body, Controller, Get, Param, ParseIntPipe, Post, UseGuards } from '@nestjs/common';
import { FeekService } from './feek.service';
import { AuthGuard } from '@nestjs/passport';
import { LoginUser } from 'src/auth/decorator/login-user.decorator';
import { User } from 'src/entities/user.entity';
import { AcceptFeekRequest } from './dto/accept-feek.dto';
import { ApiTags } from '@nestjs/swagger';
import { AcceptFeekAPI, GetFeekDetailAPI, RejectFeekAPI, RequestFeekAPI } from 'src/common/swagger/decorator/feek-api.decorator';

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
    @LoginUser() loginUser: User
  ) {
    return await this.feekService.requestFeek(letterId, loginUser);
  }

  @Get('/:feekId')
  @UseGuards(AuthGuard())
  @GetFeekDetailAPI()
  async getFeekDetail(
    @Param('feekId', ParseIntPipe) feekId: number,
    @LoginUser() loginUser: User
  ) {
    return await this.feekService.getFeekDetail(feekId, loginUser);
  }

  @Post('/:feekId/accept')
  @UseGuards(AuthGuard())
  @AcceptFeekAPI()
  async acceptFeek(
    @Param('feekId', ParseIntPipe) feekId: number,
    @LoginUser() loginUser: User,
    @Body() dto: AcceptFeekRequest
  ) {
    return await this.feekService.acceptFeek(feekId, loginUser, dto);
  }

  @Post('/:feekId/reject')
  @UseGuards(AuthGuard())
  @RejectFeekAPI()
  async rejectFeek(
    @Param('feekId', ParseIntPipe) feekId: number,
    @LoginUser() loginUser: User
  ) {
    return await this.feekService.rejectFeek(feekId, loginUser);
  }
}
