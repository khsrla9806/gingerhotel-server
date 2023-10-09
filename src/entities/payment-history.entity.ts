import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./user.entity";
import { LocalDateTime } from "@js-joda/core";
import { LocalDateTimeTransformer } from "src/common/utils/local-date-time.transformer";

@Entity()
export class PaymentHistory {
  
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, { nullable: false })
  @JoinColumn()
  user: User;

  @Column()
  paymenyType: string;

  @Column()
  paymentContent: string;

  @Column()
  paymentAmount: number;

  @Column()
  paymentStatus: string;

  @Column({
    type: 'timestamptz',
    transformer: new LocalDateTimeTransformer()
  })
  paymentDate: LocalDateTime;
}