import { Model, Table, Column, DataType } from "sequelize-typescript";
import { ApiProperty } from "@nestjs/swagger";

@Table({ tableName: 'profile'} )
export class Profile extends Model {

  @ApiProperty({
    example: '0',
    description: 'Идентификатор профиля',
  })
  @Column({ type: DataType.BIGINT, primaryKey: true, autoIncrement: true })
  id: number;

  @ApiProperty({
    example: 'Иван',
    description: 'Имя пользователя',
  })
  @Column({ type: DataType.STRING, allowNull: false })
  name: string;

  @ApiProperty({
    example: 'Иванов',
    description: 'Фамилия пользователя',
  })
  @Column({ type: DataType.STRING, allowNull: false })
  surname: string;

  @ApiProperty({
    example: '+79000000000',
    description: 'Номер телефона пользователя',
  })
  @Column({ type: DataType.STRING })
  phoneNumber?: string;

  @ApiProperty({
    example: 'Люблю смотреть фильмы',
    description: 'Описание пользователя'
  })
  @Column({ type: DataType.STRING })
  selfDescription?: string;

  @Column({type: DataType.BIGINT})
  userId: number;
}
