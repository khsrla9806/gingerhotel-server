import { ApiProperty } from "@nestjs/swagger";

export class AcceptFeekRequest {
  @ApiProperty({ description: '엿보기 요청에 대한 응답', example: '뒤에 앉은 사람' })
  comment: string;
}