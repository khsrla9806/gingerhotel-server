import { Type } from "class-transformer";
import { IsEnum, IsNotEmpty, IsString } from "class-validator";
import { DeviceStatus } from "src/entities/domain/device-status.type";

export class CreateDeviceRequestDTO {
    @Type(() => String)
    @IsString({ message:  'token must be of string type' })
    @IsNotEmpty({ message: 'token must be not empty' })
    private token: string;

    @Type(() => String)
    @IsEnum(DeviceStatus, { message: 'status must be in granted, denied, undetermined' })
    @IsNotEmpty({ message: 'status must be not empty' })
    private status: DeviceStatus;

    constructor(
        token: string,
        status: DeviceStatus
    ) {
        this.token = token;
        this.status = status;
    }


    public getToken(): string {
        return this.token;
    }

    public getStatus(): DeviceStatus {
        return this.status;
    }

}