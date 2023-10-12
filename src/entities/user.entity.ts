import { CoreEntity } from "src/entities/core.entity";
import { Column, Entity } from "typeorm";
import { IsEmail } from "class-validator";
import { Vendor } from "./domain/vendor.type";
import { Gender } from "./domain/gender.type";
import { MembershipType } from "./domain/membership.type";
import { Membership, MembershipInfo } from "./domain/membership.info";

@Entity()
export class User extends CoreEntity {

    @Column({
        type: 'enum',
        enum: MembershipType,
        default: MembershipType.FREE,
        nullable: false
    })
    private membership: MembershipType;
    
    @Column({ unique: true, nullable: false })
    private socialId: string;

    @Column({ nullable: false })
    private vendor: Vendor;

    @Column({ nullable: true })
    @IsEmail()
    private email?: string;

    @Column({ nullable: true })
    private birthYear?: number;

    @Column({ nullable: true })
    private gender?: Gender;

    @Column({ default: true })
    private isActive: boolean;

    @Column({ nullable: false, unique: true, length: 7 })
    private code: string;

    @Column({ default: 0 })
    private feekCount: number;

    @Column({ default: 0 })
    private keyCount: number;

    public getMembershipInfo(): MembershipInfo {
        return Membership.getInfoByMembershipType(this.membership);
    }

}