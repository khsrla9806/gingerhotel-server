/* eslint-disable */
import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { CoreEntity } from 'src/entities/core.entity';
import { HotelWindow } from 'src/entities/hotel-window.entity';
import { Letter } from 'src/entities/letter.entity';
import { User } from 'src/entities/user.entity';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

@Entity()
export class Reply extends CoreEntity {

  @ManyToOne(() => HotelWindow, { nullable: false })
  @JoinColumn()
  hotelWindow: HotelWindow;

  @ManyToOne(() => User, { nullable: false })
  @JoinColumn()
  sender: User;

  @ManyToOne(() => Letter, { nullable: false })
  @JoinColumn()
  letter: Letter;

  @Column()
  content: string;

  @Column({ default: false })
  isDeleted: boolean;

  @Column({ nullable: true, length: 1000 })
  imageUrl: string;
}
