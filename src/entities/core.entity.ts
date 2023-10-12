import { CreateDateColumn, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

export class CoreEntity {
    @PrimaryGeneratedColumn()
    id: number;
    
    @CreateDateColumn()
    creaedAt: Date;
    
    @UpdateDateColumn()
    updateAt: Date;
}