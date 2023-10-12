import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./user.entity";
import { LocalDateTime } from "@js-joda/core";
import { LocalDateTimeTransformer } from "src/common/utils/local-date-time.transformer";

@Entity()
export class PaymentHistory {
  
  @PrimaryGeneratedColumn()
  private id: number;

  @ManyToOne(() => User, { nullable: false })
  @JoinColumn()
  private user: User;

  @Column()
  private paymenyType: string;

  @Column()
  private paymentContent: string;

  @Column()
  private paymentAmount: number;

  @Column()
  private paymentStatus: string;

  @Column({
    type: 'timestamptz',
    transformer: new LocalDateTimeTransformer()
  })
  private paymentDate: LocalDateTime;
}