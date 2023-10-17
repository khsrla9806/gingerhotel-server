import { Body, Controller, Delete, Param, ParseIntPipe, Post, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { LettersService } from './letters.service';
import { AuthGuard } from '@nestjs/passport';
import { LoginUser } from 'src/auth/decorator/login-user.decorator';
import { User } from 'src/entities/user.entity';
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
    @LoginUser() loginUser: User,
    @UploadedFile() image: Express.Multer.File,
    @Body() dto: CreateLetterRequest
  ) {
    return await this.letterService.createLetter(hotelId, loginUser, image, dto);
  }

  @Delete('/:letterId')
  @UseGuards(AuthGuard())
  @DeleteLetterAPI()
  async deleteLetter(
    @Param('letterId', ParseIntPipe) letterId: number,
    @LoginUser() loginUser: User
  ) {
    return await this.letterService.deleteLetter(letterId, loginUser);
  }

}
