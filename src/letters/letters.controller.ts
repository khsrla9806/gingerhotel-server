import { Body, Controller, Delete, Param, ParseIntPipe, Post, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { LettersService } from './letters.service';
import { AuthGuard } from '@nestjs/passport';
import { LoginMember } from 'src/auth/decorator/login-member.decorator';
import { Member } from 'src/entities/member.entity';
import { FileInterceptor } from '@nestjs/platform-express';
import { CreateLetterRequest } from './dto/create-letter.dto';
import { CreateLetterAPI, DeleteLetterAPI } from 'src/common/swagger/decorator/letter-api.decorator';

@Controller('letters')
@ApiTags('Letters API')
export class LettersController {

  constructor(
    private readonly letterService: LettersService
  ) {}

  @Post('/hotel/:hotelId')
  @UseGuards(AuthGuard())
  @UseInterceptors(FileInterceptor('image'))
  @CreateLetterAPI()
  async createLetter(
    @Param('hotelId', ParseIntPipe) hotelId: number,
    @LoginMember() loginMember: Member,
    @UploadedFile() image: Express.Multer.File,
    @Body() dto: CreateLetterRequest
  ) {
    return await this.letterService.createLetter(hotelId, loginMember, image, dto);
  }

  @Delete('/:letterId')
  @UseGuards(AuthGuard())
  @DeleteLetterAPI()
  async deleteLetter(
    @Param('letterId', ParseIntPipe) letterId: number,
    @LoginMember() loginMember: Member
  ) {
    return await this.letterService.deleteLetter(letterId, loginMember);
  }

}
