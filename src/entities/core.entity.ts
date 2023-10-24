import { CreateDateColumn, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

export class CoreEntity {
    @PrimaryGeneratedColumn()
    id: number;
    
    @CreateDateColumn({
        type: 'timestamptz',
        nullable: false
    })
    createdAt: Date;
    
    @UpdateDateColumn({
        type: 'timestamptz',
        nullable: false
    })
    updatedAt: Date;
}