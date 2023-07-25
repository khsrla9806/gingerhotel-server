import {
  Column,
  DataType,
  Model,
  PrimaryKey,
  Table,
  AutoIncrement,
} from 'sequelize-typescript';
import { ObjectType } from 'type-graphql';

@Table({ timestamps: false, paranoid: true, tableName: 'user' })
@ObjectType()
export class UserSchema extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column({ type: DataType.BIGINT({ length: 20 }) })
  user_idx: number;

  @Column
  user_name: string;
}
