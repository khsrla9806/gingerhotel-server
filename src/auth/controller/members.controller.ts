import { Controller, Get, Param, ParseIntPipe, UseGuards } from "@nestjs/common";
import { MemberService } from "../service/members.service";
import { AuthGuard } from "@nestjs/passport";
import { LoginMember } from "../decorator/login-member.decorator";
import { Member } from "src/entities/member.entity";
import { ApiTags } from "@nestjs/swagger";
import { GetMemberInfoAPI } from "src/common/swagger/decorator/member-api.decorator";

@Controller('members')
@ApiTags('Member API')
export class MemberController {
  constructor(
    private readonly memberService: MemberService
  ) {}

  @Get('/:memberId')
  @UseGuards(AuthGuard())
  @GetMemberInfoAPI()
  async getMemberInfo(
    @Param('memberId', ParseIntPipe) memberId: number,
    @LoginMember() loginMember: Member
  ) {
    return await this.memberService.getMemberInfo(memberId, loginMember);
  }
}