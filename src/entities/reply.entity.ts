import { CoreEntity } from 'src/entities/core.entity';
import { HotelWindow } from 'src/entities/hotel-window.entity';
import { Letter } from 'src/entities/letter.entity';
import { Member } from './member.entity';
import { Column, Entity, Index, JoinColumn, ManyToOne } from 'typeorm';

@Entity()
export class Reply extends CoreEntity {

  @ManyToOne(() => HotelWindow, { nullable: false })
  @JoinColumn()
  @Index()
  hotelWindow: HotelWindow;

  @ManyToOne(() => Member, { nullable: false })
  @JoinColumn()
  sender: Member;

  @ManyToOne(() => Letter, { nullable: false })
  @JoinColumn()
  @Index()
  letter: Letter;

  @Column()
  content: string;

  @Column({ default: false })
  isDeleted: boolean;

  @Column({ default: false })
  isBlocked: boolean;

  @Column({ nullable: true, length: 1000 })
  imageUrl: string;

  @Column({ nullable: false, default: '0.0.0.0' })
  ip: string;
}
