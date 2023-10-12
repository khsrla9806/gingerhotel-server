import { Column, Entity, JoinColumn, ManyToOne } from "typeorm";
import { CoreEntity } from "./core.entity";
import { User } from "./user.entity";

@Entity()
export class NotificationHistory extends CoreEntity {

  @ManyToOne(() => User, { nullable: false })
  @JoinColumn()
  private user: User;
  
  @Column()
  private type: string;

  @Column()
  private typeId: number;

  @Column()
  private message: string;

  @Column({ default: false })
  private isChecked: boolean;
}