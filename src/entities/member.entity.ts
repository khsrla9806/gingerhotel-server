import { CoreEntity } from "src/entities/core.entity";
import { Column, Entity, Unique } from "typeorm";
import { Vendor } from "./domain/vendor.type";
import { Gender } from "./domain/gender.type";
import { MembershipType } from "./domain/membership.type";
import { Membership, MembershipInfo } from "./domain/membership.info";
import { LocalDate } from "@js-joda/core";
import { LocalDateTransformer } from "src/common/utils/local-date-time.transformer";

@Unique(['socialId', 'vendor'])
@Entity()
export class Member extends CoreEntity {

    @Column({
        type: 'enum',
        enum: MembershipType,
        default: MembershipType.FREE,
        nullable: false
    })
    membership: MembershipType;
    
    @Column({ nullable: false })
    socialId: string;

    @Column({ nullable: false })
    vendor: Vendor;

    @Column({ nullable: true })
    email?: string;

    @Column({
        type: 'date',
        transformer: new LocalDateTransformer(),
        nullable: true
      })
    birthDate?: LocalDate;

    @Column({ 
        type: 'enum',
        enum: Gender,
        nullable: true
     })
    gender?: Gender;

    @Column({ default: true })
    isActive: boolean;

    @Column({ default: false })
    hasHotel: boolean;

    @Column({ nullable: true, unique: true, length: 7 })
    code: string;

    @Column({ default: 0 })
    feekCount: number;

    @Column({ default: 0 })
    keyCount: number;

    getMembershipInfo(): MembershipInfo {
        return Membership.getInfoByMembershipType(this.membership);
    }

}