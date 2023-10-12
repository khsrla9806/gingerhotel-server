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
    membership: MembershipType;
    
    @Column({ unique: true, nullable: false })
    socialId: string;

    @Column({ nullable: false })
    vendor: Vendor;

    @Column({ nullable: true })
    @IsEmail()
    email?: string;

    @Column({ nullable: true })
    birthYear?: number;

    @Column({ nullable: true })
    gender?: Gender;

    @Column({ default: true })
    isActive: boolean;

    @Column({ nullable: false, unique: true, length: 7 })
    code: string;

    @Column({ default: 0 })
    feekCount: number;

    @Column({ default: 0 })
    keyCount: number;

    public getMembershipInfo(): MembershipInfo {
        return Membership.getInfoByMembershipType(this.membership);
    }

}