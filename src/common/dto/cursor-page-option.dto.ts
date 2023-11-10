import { Type } from "class-transformer";
import { Order } from "./cursor-page-order.enum";
import { IsEnum, IsNumber, IsOptional } from "class-validator";

export class CursorPageOptionDTO {
    @Type(() => String)
    @IsEnum(Order, { message: 'sort is asc or desc' })
    @IsOptional()
    readonly sort?: Order = Order.DESC;

    @Type(() => Number)
    @IsNumber({}, { message: 'size must be number' })
    @IsOptional()
    readonly size?: number = 10;

    @Type(() => Number)
    @IsNumber({}, { message: 'cursorId must be number' })
    @IsOptional()
    readonly cursorId?: number = undefined;
}