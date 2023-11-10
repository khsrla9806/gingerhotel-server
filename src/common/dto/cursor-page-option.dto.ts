import { Type } from "class-transformer";
import { Order } from "./cursor-page-order.enum";
import { IsEnum, IsNumber, IsOptional } from "class-validator";
import { ApiPropertyOptional } from "@nestjs/swagger";

export class CursorPageOptionDTO {
    @Type(() => String)
    @IsEnum(Order, { message: 'sort is asc or desc' })
    @IsOptional()
    @ApiPropertyOptional({ description: '정렬 조건입니다. 입력하지 않으면 Default로 DESC가 적용' })
    readonly sort?: Order = Order.DESC;

    @Type(() => Number)
    @IsNumber({}, { message: 'size must be number' })
    @IsOptional()
    @ApiPropertyOptional({ description: '가져올 데이터 사이즈입니다. 입력하지 않으면 Default로 10 적용' })
    readonly size?: number = 10;

    @Type(() => Number)
    @IsNumber({}, { message: 'cursorId must be number' })
    @IsOptional()
    @ApiPropertyOptional({ description: '이전 데이터의 마지막 요소의 Id입니다. 첫 페이지 조회를 위해서는 입력하지 않아도 됩니다.' })
    readonly cursorId?: number = undefined;
}