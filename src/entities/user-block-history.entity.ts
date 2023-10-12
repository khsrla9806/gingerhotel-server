import { Entity, JoinColumn, ManyToOne, Unique } from "typeorm";
import { CoreEntity } from "./core.entity";
import { User } from "./user.entity";

@Unique(['fromUser', 'toUser'])
@Entity()
export class UserBlockHistory extends CoreEntity {

  @ManyToOne(() => User, { nullable: false })
  @JoinColumn()
  private fromUser: User;

  @ManyToOne(() => User, { nullable: false })
  @JoinColumn()
  private toUser: User;
}