/* eslint-disable */
import { Field, InputType, ObjectType } from "@nestjs/graphql";
import { CoreEntity } from "src/common/entities/core.entity";
import { Column, Entity } from "typeorm";
import { IsEmail, IsEnum } from "class-validator";
import { Letter } from "src/letters/entities/letter.entity";
import { Vendor } from "./vendor.type";
import { Gender } from "./gender.type";

@InputType({ isAbstract: true})
@ObjectType()
@Entity()
export class User extends CoreEntity {
   
    @Column({ nullable: true })
    @Field(type => String)
    @IsEmail()
    email: string;
    
    @Column({ unique: true, nullable: false })
    @Field(type => String)
    socialId: string;

    @Column({ nullable: false })
    @Field(type => Vendor)
    vendor: Vendor;

    @Column({ nullable: true })
    @Field(type => Number)
    age: number; // (미정) 연령대

    @Column({ nullable: true })
    @Field(type => Gender)
    gender: Gender;

}