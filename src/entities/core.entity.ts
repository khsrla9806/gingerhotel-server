/* eslint-disable */import { Field } from "@nestjs/graphql";
import { CreateDateColumn, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { LocalDateTimeTransformer } from "../common/utils/local-date-time.transformer";
import { LocalDateTime } from "@js-joda/core";

export class CoreEntity {
    @PrimaryGeneratedColumn()
    @Field(type => Number)
    id: number;
    
    @Field(type => LocalDateTime)
    @CreateDateColumn({ 
        type: 'timestamptz', 
        transformer: new LocalDateTimeTransformer() 
    })
    creaedAt: LocalDateTime;
    
    @Field(type => LocalDateTime)
    @UpdateDateColumn({
        type: 'timestamptz', 
        transformer: new LocalDateTimeTransformer() 
    })
    updateAt: LocalDateTime;
}