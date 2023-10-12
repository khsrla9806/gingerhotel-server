import { CoreEntity } from 'src/entities/core.entity';
import { User } from 'src/entities/user.entity';
import { Column, Entity, JoinColumn, OneToOne } from 'typeorm';

@Entity()
export class Hotel extends CoreEntity {

  @JoinColumn()
  @OneToOne(type => User, { nullable: false })
  private user: User;

  @Column()
  private nickname: string;

  @Column()
  private description: string;

  @Column()
  private headColor: string;

  @Column()
  private bodyColor: string;

}
