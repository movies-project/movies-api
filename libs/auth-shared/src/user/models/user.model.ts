import { Model, Table, Column, DataType, Default } from "sequelize-typescript";
import { ApiProperty } from "@nestjs/swagger";

@Table({ tableName: 'user'} )
export class User extends Model {
  @ApiProperty({
    example: '0',
    description: 'Идентификатор пользователя',
  })
  @Column({ type: DataType.BIGINT, primaryKey: true, autoIncrement: true })
  id: number;

  @ApiProperty({
    example: 'example@gmail.com',
    description: 'Электронная почта пользователя',
    format: 'email'
  })
  @Column({ type: DataType.STRING, allowNull: false, unique: true })
  email: string;

  @Column({ type: DataType.STRING, allowNull: false })
  passwordHash: string;

  @ApiProperty({
    example: 'user',
    description: 'Роль пользователя',
  })
  @Default('user')
  @Column({ type: DataType.STRING, allowNull: false })
  role: string;
}