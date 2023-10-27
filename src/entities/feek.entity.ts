import { Column, Entity, JoinColumn, ManyToOne, OneToOne } from "typeorm";
import { CoreEntity } from "./core.entity";
import { Member } from "./member.entity";
import { Letter } from "./letter.entity";
import { FeekStatus } from "./domain/feek-status.type";

@Entity()
export class Feek extends CoreEntity {
  
  @ManyToOne(() => Member, { nullable: false })
  @JoinColumn()
  requestor: Member;

  @OneToOne(() => Letter, { nullable: false })
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