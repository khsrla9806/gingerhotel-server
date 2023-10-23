import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, UseGuards } from "@nestjs/common";
import { MemberService } from "../service/members.service";
import { AuthGuard } from "@nestjs/passport";
import { LoginMember } from "../decorator/login-member.decorator";
import { Member } from "src/entities/member.entity";
import { ApiTags } from "@nestjs/swagger";
import { GetMemberInfoAPI, UpdateMemberInfoAPI } from "src/common/swagger/decorator/member-api.decorator";
import { UpdateMemberRequest } from "../dto/update-member.dto";
import { UpdateMemberValidationPipe } from "../pipes/update-member.validation.pipe";

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

  @Patch('/:memberId')
  @UseGuards(AuthGuard())
  @UpdateMemberInfoAPI()
  async updateMemberInfo(
    @Param('memberId', ParseIntPipe) memberId: number,
    @Body(UpdateMemberValidationPipe) dto: UpdateMemberRequest,
    @LoginMember() loginMember: Member
  ) {
    return await this.memberService.updateMemberInfo(memberId, dto, loginMember);
  }

  @Delete('/:memberId')
  @UseGuards(AuthGuard())
  async deleteMember(
    @Param('memberId', ParseIntPipe) memberId: number,
    @LoginMember() loginMember: Member
  ) {
    return await this.memberService.deleteMember(memberId, loginMember);
  }
}