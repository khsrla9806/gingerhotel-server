import { Column, Entity, JoinColumn, ManyToOne, Unique } from "typeorm";
import { CoreEntity } from "./core.entity";
import { Member } from "./member.entity";

@Unique(['fromMember', 'toMember'])
@Entity()
export class MemberBlockHistory extends CoreEntity {

  @ManyToOne(() => Member, { nullable: false })
  @JoinColumn()
  fromMember: Member;

  @ManyToOne(() => Member, { nullable: false })
  @JoinColumn()
  toMember: Member;

  @Column({ default: 1 })
  count: number;
}