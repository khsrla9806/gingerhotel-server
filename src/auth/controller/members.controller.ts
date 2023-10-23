import { Controller, Get, Param, ParseIntPipe, UseGuards } from "@nestjs/common";
import { MemberService } from "../service/members.service";
import { AuthGuard } from "@nestjs/passport";
import { LoginMember } from "../decorator/login-member.decorator";
import { Member } from "src/entities/member.entity";

@Controller('members')
export class MemberController {
  constructor(
    private readonly memberService: MemberService
  ) {}

  @Get('/:memberId')
  @UseGuards(AuthGuard())
  async getMemberInfo(
    @Param('memberId', ParseIntPipe) memberId: number,
    @LoginMember() loginMember: Member
  ) {
    return await this.memberService.getMemberInfo(memberId, loginMember);
  }
}