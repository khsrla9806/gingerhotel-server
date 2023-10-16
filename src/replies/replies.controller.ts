import { Body, Controller, Delete, Param, ParseIntPipe, Post, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags } from '@nestjs/swagger';
import { LoginUser } from 'src/auth/decorator/login-user.decorator';
import { CreateReplyRequest } from './dto/create-reply.dto';
import { User } from 'src/entities/user.entity';
import { RepliesService } from './replies.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { CreateReplyAPI } from 'src/common/swagger/decorator/create-reply.decorator';

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
    @LoginUser() loginUser: User,
    @UploadedFile() image: Express.Multer.File,
    @Body() dto: CreateReplyRequest
  ) {
    return await this.repliesService.createReply(letterId, loginUser, image, dto);
  }

  @Delete('/:replyId')
  @UseGuards(AuthGuard())
  async deleteReply(
    @Param('replyId', ParseIntPipe) replyId: number,
    @LoginUser() loginUser: User
  ) {
    return await this.repliesService.deleteReply(replyId, loginUser);
  }
}
