import { Column, Entity, JoinColumn, ManyToOne } from "typeorm";
import { CoreEntity } from "./core.entity";
import { User } from "./user.entity";
import { Letter } from "./letter.entity";

@Entity()
export class Feek extends CoreEntity {
  
  @ManyToOne(() => User, { nullable: false })
  @JoinColumn()
  private requestor: User;

  @ManyToOne(() => Letter, { nullable: false })
  @JoinColumn()
  private letter: Letter;

  @Column()
  private requestorName: string;

  @Column()
  private feekStatus: string;

  @Column({ nullable: true })
  private comment: string;
}