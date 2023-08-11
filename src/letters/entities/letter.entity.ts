/* eslint-disable */
import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { IsString, Length } from 'class-validator';
import { CoreEntity } from 'src/common/entities/core.entity';
import { User } from 'src/users/entities/user.entity';
import { Window } from 'src/windows/entities/window.entity';
import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
//import { Category } from './cetegory.entity';

@InputType('LetterInputType', { isAbstract: true })
@ObjectType()
@Entity()
export class Letter extends CoreEntity {
  @Field(type => String)
  @Column()
  @IsString() 
  @Length(12)
  sender: string;

  @Field(type => String)
  @Column()
  @IsString()
  content: string;

//   @Field(type => User)
//   @ManyToOne(
//     type => User,
//     (user) => user.letters,
//   )
//   @JoinColumn()
//   user: User;
  
  /*@Field(type => Category, { nullable: true })
  @ManyToOne(
    type => Category,
    category => category.restaurants,
    { nullable: true, onDelete: 'SET NULL' },
  )
  category: Category;

  @Field(type => User)
  @ManyToOne(
    type => User,
    user => user.restaurants,
  )
  owner: User;*/
}
