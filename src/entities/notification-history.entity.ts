import { Column, Entity, JoinColumn, ManyToOne } from "typeorm";
import { CoreEntity } from "./core.entity";
import { Member } from "./member.entity";

@Entity()
export class NotificationHistory extends CoreEntity {

  @ManyToOne(() => Member, { nullable: false })
  @JoinColumn()
  member: Member;
  
  @Column()
  type: string;

  @Column()
  typeId: number;

  @Column()
  message: string;

  @Column({ default: false })
  isChecked: boolean;
}