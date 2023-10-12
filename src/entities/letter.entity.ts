import { CoreEntity } from 'src/entities/core.entity';
import { HotelWindow } from 'src/entities/hotel-window.entity';
import { User } from 'src/entities/user.entity';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

@Entity()
export class Letter extends CoreEntity {

  @ManyToOne(() => HotelWindow, { nullable: false })
  @JoinColumn()
  private hotelWindow: HotelWindow;

  @ManyToOne(() => User, { nullable: false })
  @JoinColumn()
  private sender: User;

  @Column()
  private senderNickname: string;

  @Column()
  private content: string;

  @Column({ default: false })
  private isDeleted: boolean;

  @Column({ nullable: true, length: 1000 })
  private imageUrl: string;
}
