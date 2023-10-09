/* eslint-disable */
import { Field, InputType, ObjectType } from "@nestjs/graphql";
import { CoreEntity } from "src/entities/core.entity";
import { Column, Entity, JoinColumn, OneToOne } from "typeorm";
import { IsEmail } from "class-validator";
import { Vendor } from "./domain/vendor.type";
import { Gender } from "./domain/gender.type";
import { Membership } from "./membership.entity";

@InputType({ isAbstract: true})
@ObjectType()
@Entity()
export class User extends CoreEntity {

    @JoinColumn()
    @OneToOne(() => Membership, { nullable: false })
    membership: Membership;
    
    @Column({ unique: true, nullable: false })
    @Field(type => String)
    socialId: string;

    @Column({ nullable: false })
    @Field(type => Vendor)
    vendor: Vendor;

    @Column({ nullable: true })
    @Field(type => String)
    @IsEmail()
    email?: string;

    @Column({ nullable: true })
    @Field(type => Number)
    birthYear?: number;

    @Column({ nullable: true })
    @Field(type => Gender)
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