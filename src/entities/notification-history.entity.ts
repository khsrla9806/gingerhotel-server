import { Column, Entity, JoinColumn, ManyToOne } from "typeorm";
import { CoreEntity } from "./core.entity";
import { Member } from "./member.entity";
import { NotificationType } from "./domain/notification.type";

@Entity()
export class NotificationHistory extends CoreEntity {

  @ManyToOne(() => Member, { nullable: false })
  @JoinColumn()
  member: Member;
  
  @Column({
    type: 'enum',
    enum: NotificationType,
    nullable: false
  })
  type: NotificationType;

  @Column()
  typeData: string;

  @Column()
  message: string;

  @Column({ default: false })
  isChecked: boolean;
}