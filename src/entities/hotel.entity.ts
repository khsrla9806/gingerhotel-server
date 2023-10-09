/* eslint-disable */
import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { CoreEntity } from 'src/entities/core.entity';
import { User } from 'src/entities/user.entity';
import { Column, Entity, JoinColumn, OneToOne } from 'typeorm';

@InputType('HotelInputType', { isAbstract: true })
@ObjectType()
@Entity()
export class Hotel extends CoreEntity {

  @JoinColumn()
  @OneToOne(type => User, { nullable: false })
  user: User;

  @Field(type => String)
  @Column()
  nickname: string;

  @Field(type => String)
  @Column()
  description: string;

  @Field(type => String, { defaultValue: '#FFFFFF' })
  @Column()
  headColor: string;

  @Field(type => String, { defaultValue: '#FFFFFF' })
  @Column()
  bodyColor: string;

}
