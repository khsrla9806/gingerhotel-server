/* eslint-disable */
import { Field, InputType, ObjectType, registerEnumType } from "@nestjs/graphql";
import { CoreEntity } from "src/common/entities/core.entity";
import { BeforeInsert, Column, Entity, OneToMany, OneToOne } from "typeorm";
import * as bcrypt from 'bcrypt';
import { InternalServerErrorException } from "@nestjs/common";
import { IsEmail, IsEnum } from "class-validator";
import { Letter } from "src/letters/entities/letter.entity";

enum UserRole {
    Client,
    Owner,
    Delivery
}

registerEnumType(UserRole, {name: 'UserRole'});

@InputType({ isAbstract: true})
@ObjectType()
@Entity()
export class User extends CoreEntity {
   
    @Column()
    @Field(type => String)
    @IsEmail()
    email: string;
    
    @Column()
    @Field(type => String)
    password: string;
    
    @Column({ type: 'enum', enum: UserRole})
    @Field(type => UserRole)
    @IsEnum(UserRole)
    role: UserRole;
    
    @BeforeInsert()
    async hashPassword(): Promise<void> {
        try {
            this.password = await bcrypt.hash(this.password, 10);
        } catch (error) {
            console.log(error);
            throw new InternalServerErrorException();
        }
    }

    // @OneToMany(() => Letter, (letter) => letter.user)
    // letters: Letter[];

}