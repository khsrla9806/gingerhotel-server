import { Column, Entity, JoinColumn, ManyToOne } from "typeorm";
import { CoreEntity } from "./core.entity";
import { User } from "./user.entity";

@Entity()
export class NotificationHistory extends CoreEntity {

  @ManyToOne(() => User, { nullable: false })
  @JoinColumn()
  user: User;
  
  @Column()
  type: string;

  @Column()
  typeId: number;

  @Column()
  message: string;

  @Column({ default: false })
  isChecked: boolean;
}