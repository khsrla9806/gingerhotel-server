import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsNotEmpty, MaxLength, MinLength } from "class-validator";

export class CreateLetterRequest {
  @ApiProperty({ description: '편지 작성자가 입력한 닉네임', example: '헤르미온느' })
  @IsNotEmpty({ message: '작성자 닉네임은 필수 값입니다.' })
  @MinLength(1, { message: '작성자 닉네임은 최소 1글자이상 작성해야 합니다.' })
  @MaxLength(15, { message: '작성자 닉네임은 최대 15자입니다.' })
  senderNickname: string;

  @ApiProperty({ description: '편지 작성자가 입력한 편지 내용', example: '포터야 이번주에 영화보러 갈래?' })
  @IsNotEmpty({ message: '편지 내용은 필수 값입니다.' })
  @MinLength(1, { message: '편지 내용은 최소 1글자이상 작성해야 합니다.' })
  @MaxLength(300, { message: '편지 내용은 최대 300자입니다.' })
  content: string;

  @ApiProperty({ description: '편지 작성자의 ip 정보', example: '127.0.0.1' })
  ip: string;

  @ApiPropertyOptional({ description: '편지 작성자 첨부한 이미지', type: 'string', format: 'binary' })
  image?: Express.Multer.File;
}