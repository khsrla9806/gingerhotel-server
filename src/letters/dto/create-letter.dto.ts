import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export class CreateLetterRequest {
  @ApiProperty({ description: '편지 작성자가 입력한 닉네임', example: '헤르미온느' })
  senderNickname: string;

  @ApiProperty({ description: '편지 작성자가 입력한 편지 내용', example: '포터야 이번주에 영화보러 갈래?' })
  content: string;

  @ApiPropertyOptional({ description: '편지 작성자 첨부한 이미지', type: 'string', format: 'binary' })
  image?: Express.Multer.File;
}