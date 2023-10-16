import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export class CreateReplyRequest {
  @ApiProperty({ description: '답장 작성자가 입력한 답장 내용', example: '헤르미온느 너가 누군지 알려줘야 가지' })
  content: string;

  @ApiPropertyOptional({ description: '답장 작성자 첨부한 이미지', type: 'string', format: 'binary' })
  image?: Express.Multer.File;
}