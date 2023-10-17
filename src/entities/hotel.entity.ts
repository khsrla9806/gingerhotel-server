import { CoreEntity } from 'src/entities/core.entity';
import { Member } from './member.entity';
import { Column, Entity, JoinColumn, OneToOne } from 'typeorm';

@Entity()
export class Hotel extends CoreEntity {

  @JoinColumn()
  @OneToOne(type => Member, { nullable: false })
  member: Member;

  @Column()
  nickname: string;

  @Column()
  description: string;

  @Column()
  headColor: string;

  @Column()
  bodyColor: string;

}
