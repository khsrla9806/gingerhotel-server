import { Body, Controller, Delete, Get, Patch, UseGuards } from "@nestjs/common";
import { MemberService } from "../service/members.service";
import { AuthGuard } from "@nestjs/passport";
import { LoginMember } from "../decorator/login-member.decorator";
import { Member } from "src/entities/member.entity";
import { ApiTags } from "@nestjs/swagger";
import { DeleteMemberAPI, GetMemberInfoAPI, UpdateMemberInfoAPI } from "src/common/swagger/decorator/member-api.decorator";
import { UpdateMemberRequest } from "../dto/update-member.dto";
import { UpdateMemberValidationPipe } from "../pipes/update-member.validation.pipe";

@Controller('members')
@ApiTags('Member API')
export class MemberController {
  constructor(
    private readonly memberService: MemberService
  ) {}

  @Get('/my')
  @UseGuards(AuthGuard())
  @GetMemberInfoAPI()
  async getMemberInfo(
    @LoginMember() loginMember: Member
  ) {
    return await this.memberService.getMemberInfo(loginMember);
  }

  @Patch('/me')
  @UseGuards(AuthGuard())
  @UpdateMemberInfoAPI()
  async updateMemberInfo(
    @Body(UpdateMemberValidationPipe) dto: UpdateMemberRequest,
    @LoginMember() loginMember: Member
  ) {
    return await this.memberService.updateMemberInfo(dto, loginMember);
  }

  @Delete('/me')
  @UseGuards(AuthGuard())
  @DeleteMemberAPI()
  async deleteMember(
    @LoginMember() loginMember: Member
  ) {
    return await this.memberService.deleteMember(loginMember);
  }
}