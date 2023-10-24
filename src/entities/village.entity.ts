import { Column, Entity, JoinColumn, ManyToOne, Unique } from "typeorm";
import { CoreEntity } from "./core.entity";
import { Member } from "./member.entity";
import { Hotel } from "./hotel.entity";

@Unique(['fromMember', 'toHotel'])
@Entity()
export class Village extends CoreEntity {
  @ManyToOne(() => Member, { nullable: false })
  @JoinColumn()
  fromMember: Member;

  @ManyToOne(() => Hotel, { nullable: false })
  @JoinColumn()
  toHotel: Hotel;

  @Column({ default: false })
  isBookmark: boolean;
}