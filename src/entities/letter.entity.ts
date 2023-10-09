/* eslint-disable */
import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { IsString, Length } from 'class-validator';
import { CoreEntity } from 'src/entities/core.entity';
import { HotelWindow } from 'src/entities/hotel-window.entity';
import { User } from 'src/entities/user.entity';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

@InputType('LetterInputType', { isAbstract: true })
@ObjectType()
@Entity()
export class Letter extends CoreEntity {

  @ManyToOne(() => HotelWindow, { nullable: false })
  @JoinColumn()
  hotelWindow: HotelWindow;

  @ManyToOne(() => User, { nullable: false })
  @JoinColumn()
  sender: User;

  @Field(type => String)
  @Column()
  senderNickname: string;

  @Field(type => String)
  @Column()
  content: string;

  @Column({ default: false })
  isDeleted: boolean;

  @Column({ nullable: true, length: 1000 })
  imageUrl: string;
}
