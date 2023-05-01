import { Model, Table, Column, DataType, Default } from "sequelize-typescript";

@Table({ tableName: 'user'} )
export class UserModel extends Model {
  @Column({ type: DataType.BIGINT, primaryKey: true, autoIncrement: true })
  id: number;

  @Column({ type: DataType.STRING, allowNull: false, unique: true })
  email: string;

  @Column({ type: DataType.STRING, allowNull: false })
  passwordHash: string;

  @Default('user')
  @Column({ type: DataType.STRING, allowNull: false })
  role: string;
}