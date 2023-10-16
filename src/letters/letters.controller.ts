import { Body, Controller, Param, ParseIntPipe, Post, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { LettersService } from './letters.service';
import { AuthGuard } from '@nestjs/passport';
import { LoginUser } from 'src/auth/decorator/login-user.decorator';
import { User } from 'src/entities/user.entity';
import { FileInterceptor } from '@nestjs/platform-express';
import { CreateLetterRequest } from './dto/create-letter.dto';

@Controller('letters')
@ApiTags('Letters API')
export class LettersController {

  constructor(
    private readonly letterService: LettersService
  ) {}

  @Post('/hotel/:hotelId')
  @UseGuards(AuthGuard())
  @UseInterceptors(FileInterceptor('image'))
  createLetter(
    @Param('hotelId', ParseIntPipe) hotelId: number,
    @LoginUser() loginUser: User,
    @UploadedFile() image: Express.Multer.File,
    @Body() dto: CreateLetterRequest
  ) {
    return this.letterService.createLetter(hotelId, loginUser, image, dto);
  }

}
