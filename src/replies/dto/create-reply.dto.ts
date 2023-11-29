import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsNotEmpty, MaxLength, MinLength } from "class-validator";

export class CreateReplyRequest {
  @ApiProperty({ description: '답장 작성자가 입력한 답장 내용', example: '헤르미온느 너가 누군지 알려줘야 가지' })
  @IsNotEmpty({ message: '편지 내용은 필수 값입니다.' })
  @MinLength(1, { message: '편지 내용은 최소 1글자이상 작성해야 합니다.' })
  @MaxLength(300, { message: '편지 내용은 최대 300자입니다.' })
  content: string;

  @ApiProperty({ description: '편지 작성자의 ip 정보', example: '127.0.0.1' })
  @IsNotEmpty({ message: 'ip 정보는 필수 입니다.' })
  ip: string;

  @ApiPropertyOptional({ description: '답장 작성자 첨부한 이미지', type: 'string', format: 'binary' })
  image?: Express.Multer.File;
}