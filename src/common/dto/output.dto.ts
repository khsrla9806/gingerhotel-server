import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export class CommonResponse {
  @ApiPropertyOptional({ description: '에러 메시지 (success가 false일 때만 활성화)' })
  error?: string;

  @ApiProperty({ description: '응답의 성공 여부', required: true })
  success: boolean;
}