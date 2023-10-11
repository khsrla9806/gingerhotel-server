import { CoreEntity } from 'src/entities/core.entity';
import { User } from 'src/entities/user.entity';
import { Column, Entity, JoinColumn, OneToOne } from 'typeorm';

@Entity()
export class Hotel extends CoreEntity {

  @JoinColumn()
  @OneToOne(type => User, { nullable: false })
  user: User;

  @Column()
  nickname: string;

  @Column()
  description: string;

  @Column()
  headColor: string;

  @Column()
  bodyColor: string;

}
