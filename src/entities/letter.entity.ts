import { CoreEntity } from 'src/entities/core.entity';
import { HotelWindow } from 'src/entities/hotel-window.entity';
import { Member } from './member.entity';
import { Column, Entity, JoinColumn, ManyToOne, OneToOne } from 'typeorm';
import { Feek } from './feek.entity';

@Entity()
export class Letter extends CoreEntity {

  @ManyToOne(() => HotelWindow, { nullable: false })
  @JoinColumn()
  hotelWindow: HotelWindow;

  @ManyToOne(() => Member, { nullable: false })
  @JoinColumn()
  sender: Member;

  @OneToOne(() => Feek)
  feek: Feek;

  @Column()
  senderNickname: string;

  @Column()
  content: string;

  @Column({ default: false })
  isDeleted: boolean;

  @Column({ default: false })
  isBlocked: boolean;

  @Column({ nullable: true, length: 1000 })
  imageUrl: string;
}
