import { Model, Table, Column, DataType } from "sequelize-typescript";

@Table({ tableName: 'profile'} )
export class Profile extends Model {
  @Column({ type: DataType.BIGINT, primaryKey: true, autoIncrement: true })
  id: number;

  @Column({ type: DataType.STRING, allowNull: false })
  name: string;

  @Column({ type: DataType.STRING, allowNull: false })
  surname: string;

  @Column({ type: DataType.STRING })
  phoneNumber?: string;

  @Column({ type: DataType.STRING })
  selfDescription?: string;

  @Column({type: DataType.BIGINT})
  userId: number;
}
