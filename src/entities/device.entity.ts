import { Column, Entity, JoinColumn, ManyToOne, Unique } from "typeorm";
import { CoreEntity } from "./core.entity";
import { DeviceStatus } from "./domain/device-status.type";
import { Member } from "./member.entity";

@Unique(['member', 'token'])
@Entity()
export class Device extends CoreEntity {

    @ManyToOne(() => Member, { nullable: false })
    @JoinColumn()
    member: Member

    @Column()
    token: string;

    @Column({
        type: 'enum',
        enum: DeviceStatus,
        default: DeviceStatus.undetermined,
        nullable: false
    })
    status: string;
}