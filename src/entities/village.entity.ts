import { Column, Entity, JoinColumn, ManyToOne, Unique } from "typeorm";
import { CoreEntity } from "./core.entity";
import { User } from "./user.entity";

@Unique(['fromUser', 'toUser'])
@Entity()
export class Village extends CoreEntity {
  @ManyToOne(() => User, { nullable: false })
  @JoinColumn()
  fromUser: User;

  @ManyToOne(() => User, { nullable: false })
  @JoinColumn()
  toUser: User;

  @Column({ default: false })
  isBookmark: boolean;
}