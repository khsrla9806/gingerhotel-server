import { Column, Entity, JoinColumn, ManyToOne } from "typeorm";
import { CoreEntity } from "./core.entity";
import { User } from "./user.entity";
import { Letter } from "./letter.entity";

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

  @Column()
  feekStatus: string;

  @Column({ nullable: true })
  comment: string;
}