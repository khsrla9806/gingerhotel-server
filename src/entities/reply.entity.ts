import { CoreEntity } from 'src/entities/core.entity';
import { HotelWindow } from 'src/entities/hotel-window.entity';
import { Letter } from 'src/entities/letter.entity';
import { User } from 'src/entities/user.entity';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

@Entity()
export class Reply extends CoreEntity {

  @ManyToOne(() => HotelWindow, { nullable: false })
  @JoinColumn()
  private hotelWindow: HotelWindow;

  @ManyToOne(() => User, { nullable: false })
  @JoinColumn()
  private sender: User;

  @ManyToOne(() => Letter, { nullable: false })
  @JoinColumn()
  private letter: Letter;

  @Column()
  private content: string;

  @Column({ default: false })
  private isDeleted: boolean;

  @Column({ nullable: true, length: 1000 })
  private imageUrl: string;
}
