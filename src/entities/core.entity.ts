import { CreateDateColumn, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { LocalDateTimeTransformer } from "../common/utils/local-date-time.transformer";
import { LocalDateTime } from "@js-joda/core";

export class CoreEntity {
    @PrimaryGeneratedColumn()
    id: number;
    
    @CreateDateColumn({ 
        type: 'timestamptz', 
        transformer: new LocalDateTimeTransformer() 
    })
    creaedAt: LocalDateTime;
    
    @UpdateDateColumn({
        type: 'timestamptz', 
        transformer: new LocalDateTimeTransformer() 
    })
    updateAt: LocalDateTime;
}