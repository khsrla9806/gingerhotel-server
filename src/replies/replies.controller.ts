import { Body, Controller, Param, ParseIntPipe, Post, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags } from '@nestjs/swagger';
import { LoginUser } from 'src/auth/decorator/login-user.decorator';
import { CreateReplyRequest } from './dto/create-reply.dto';
import { User } from 'src/entities/user.entity';
import { RepliesService } from './replies.service';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('replies')
@ApiTags('Replies API')
export class RepliesController {

  constructor(
    private readonly repliesService: RepliesService
  ) {}

  @Post('/letter/:letterId')
  @UseGuards(AuthGuard())
  @UseInterceptors(FileInterceptor('image'))
  async createReply(
    @Param('letterId', ParseIntPipe) letterId: number,
    @LoginUser() loginUser: User,
    @UploadedFile() image: Express.Multer.File,
    @Body() dto: CreateReplyRequest
  ) {
    return await this.repliesService.createReply(letterId, loginUser, image, dto);
  }
}
