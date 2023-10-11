import { CoreEntity } from 'src/entities/core.entity';
import { HotelWindow } from 'src/entities/hotel-window.entity';
import { User } from 'src/entities/user.entity';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

@Entity()
export class Letter extends CoreEntity {

  @ManyToOne(() => HotelWindow, { nullable: false })
  @JoinColumn()
  hotelWindow: HotelWindow;

  @ManyToOne(() => User, { nullable: false })
  @JoinColumn()
  sender: User;

  @Column()
  senderNickname: string;

  @Column()
  content: string;

  @Column({ default: false })
  isDeleted: boolean;

  @Column({ nullable: true, length: 1000 })
  imageUrl: string;
}
