import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class AcceptFeekRequest {

  @IsString({ message: '엿보기 답장은 문자만 가능합니다.' })
  @IsNotEmpty({ message: '엿보기 답장은 필수 값입니다.' })
  @ApiProperty({ description: '엿보기 요청에 대한 응답', example: '뒤에 앉은 사람' })
  comment: string;
}