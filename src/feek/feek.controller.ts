import { Body, Controller, Get, Param, ParseIntPipe, Post, UseGuards } from '@nestjs/common';
import { FeekService } from './feek.service';
import { AuthGuard } from '@nestjs/passport';
import { LoginUser } from 'src/auth/decorator/login-user.decorator';
import { User } from 'src/entities/user.entity';
import { AcceptFeekRequest } from './dto/accept-feek.dto';

@Controller('feek')
export class FeekController {
  constructor(
    private readonly feekService: FeekService
  ) {}

  @Post('/letter/:letterId')
  @UseGuards(AuthGuard())
  async requestFeek(
    @Param('letterId', ParseIntPipe) letterId: number,
    @LoginUser() loginUser: User
  ) {
    return await this.feekService.requestFeek(letterId, loginUser);
  }

  @Get('/:feekId')
  @UseGuards(AuthGuard())
  async getFeekDetail(
    @Param('feekId', ParseIntPipe) feekId: number,
    @LoginUser() loginUser: User
  ) {
    return await this.feekService.getFeekDetail(feekId, loginUser);
  }

  @Post('/:feekId/accept')
  @UseGuards(AuthGuard())
  async acceptFeek(
    @Param('feekId', ParseIntPipe) feekId: number,
    @LoginUser() loginUser: User,
    @Body() dto: AcceptFeekRequest
  ) {
    return await this.feekService.acceptFeek(feekId, loginUser, dto);
  }

  @Post('/:feekId/reject')
  @UseGuards(AuthGuard())
  async rejectFeek(
    @Param('feekId', ParseIntPipe) feekId: number,
    @LoginUser() loginUser: User
  ) {
    return await this.feekService.rejectFeek(feekId, loginUser);
  }
}
