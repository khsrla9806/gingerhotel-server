import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString, MaxLength, MinLength } from "class-validator";

export class AcceptFeekRequest {

  @ApiProperty({ description: '엿보기 요청에 대한 응답', example: '뒤에 앉은 사람' })
  @IsString({ message: '엿보기 답장은 문자만 가능합니다.' })
  @IsNotEmpty({ message: '엿보기 답장은 필수 값입니다.' })
  @MinLength(1, { message: '엿보기 답장은 최소 1글자를 입력해야 합니다.' })
  @MaxLength(18, { message: '엿보기 답장은 최대 18자입니다.' })
  comment: string;
}