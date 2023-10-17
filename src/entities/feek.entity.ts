import { Column, Entity, JoinColumn, ManyToOne } from "typeorm";
import { CoreEntity } from "./core.entity";
import { User } from "./user.entity";
import { Letter } from "./letter.entity";
import { FeekStatus } from "./domain/feek-status.type";

@Entity()
export class Feek extends CoreEntity {
  
  @ManyToOne(() => User, { nullable: false })
  @JoinColumn()
  requestor: User;

  @ManyToOne(() => Letter, { nullable: false })
  @JoinColumn()
  letter: Letter;

  @Column()
  requestorName: string;

  @Column({
    type: 'enum',
    enum: FeekStatus,
    default: FeekStatus.REQUEST,
    nullable: false
  })
  feekStatus: FeekStatus;

  @Column({ nullable: true })
  comment: string;
}