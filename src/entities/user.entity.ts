import { CoreEntity } from "src/entities/core.entity";
import { IsEmail } from "class-validator";
import { Vendor } from "./domain/vendor.type";
import { Gender } from "./domain/gender.type";

@Entity()
export class User extends CoreEntity {

    
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

}