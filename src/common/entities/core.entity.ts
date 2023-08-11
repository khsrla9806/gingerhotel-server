/* eslint-disable */import { Field } from "@nestjs/graphql";
import { CreateDateColumn, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

export class CoreEntity {
    @PrimaryGeneratedColumn()
    @Field(type => Number)
    id: number;
    
    @Field(type => Date)
    @CreateDateColumn()
    creaedAt:Date;
    
    @Field(type => Date)
    @UpdateDateColumn()
    updateAt:Date;
}