import { Body, Controller, Delete, Param, ParseIntPipe, Post, UploadedFile, UseFilters, UseGuards, UseInterceptors } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags } from '@nestjs/swagger';
import { LoginMember } from 'src/auth/decorator/login-member.decorator';
import { CreateReplyRequest } from '../dto/create-reply.dto';
import { Member } from 'src/entities/member.entity';
import { RepliesService } from '../service/replies.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { BlockReplyAPI, CreateReplyAPI, DeleteReplyAPI, UnblockReplyAPI } from 'src/common/swagger/decorator/reply-api.decorator';
import { GlobalExceptionFilter } from 'src/common/filter/global-exception.filter';

@UseFilters(GlobalExceptionFilter)
@Controller('replies')
@ApiTags('Replies API')
export class RepliesController {

  constructor(
    private readonly repliesService: RepliesService
  ) {}

  @Post('/letter/:letterId')
  @UseGuards(AuthGuard())
  @UseInterceptors(FileInterceptor('image'))
  @CreateReplyAPI()
  async createReply(
    @Param('letterId', ParseIntPipe) letterId: number,
    @LoginMember() loginMember: Member,
    @UploadedFile() image: Express.Multer.File,
    @Body() dto: CreateReplyRequest
  ) {
    return await this.repliesService.createReply(letterId, loginMember, image, dto);
  }

  @Delete('/:replyId')
  @UseGuards(AuthGuard())
  @DeleteReplyAPI()
  async deleteReply(
    @Param('replyId', ParseIntPipe) replyId: number,
    @LoginMember() loginMember: Member
  ) {
    return await this.repliesService.deleteReply(replyId, loginMember);
  }

  @Post('/:replyId/block')
  @UseGuards(AuthGuard())
  @BlockReplyAPI()
  async blockReply(
    @Param('replyId', ParseIntPipe) replyId: number,
    @LoginMember() loginMember: Member
  ) {
    return await this.repliesService.blockReply(replyId, loginMember);
  }

  @Post('/:replyId/unblock')
  @UseGuards(AuthGuard())
  @UnblockReplyAPI()
  async unblockReply(
    @Param('replyId', ParseIntPipe) replyId: number,
    @LoginMember() loginMember: Member
  ) {
    return await this.repliesService.unblockReply(replyId, loginMember);
  }
}
