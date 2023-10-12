import { CreateDateColumn, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { LocalDateTimeTransformer } from "../common/utils/local-date-time.transformer";
import { LocalDateTime } from "@js-joda/core";

export class CoreEntity {
    @PrimaryGeneratedColumn()
    private id: number;
    
    @CreateDateColumn({ 
        type: 'timestamptz', 
        transformer: new LocalDateTimeTransformer() 
    })
    private creaedAt: LocalDateTime;
    
    @UpdateDateColumn({
        type: 'timestamptz', 
        transformer: new LocalDateTimeTransformer() 
    })
    private updateAt: LocalDateTime;
}