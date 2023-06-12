import { BelongsTo, Column, DataType, ForeignKey, Model, Table } from "sequelize-typescript";
import { ApiProperty } from "@nestjs/swagger";
import { Movie } from "./movie.model";

@Table({
  tableName: 'trailer',
})
export class Trailer extends Model<Trailer> {
  @ApiProperty({
    example: '0',
    description: 'Идентификатор трейлера',
  })
  @Column({ type: DataType.INTEGER, primaryKey: true, autoIncrement: true })
  id: number;

  @ApiProperty({
    example: '0',
    description: 'Идентификатор записи',
  })
  @Column({ type: DataType.INTEGER, allowNull: false })
  fileId: number;

  @ApiProperty({
    example: '0',
    description: 'Идентификатор фильма',
  })
  @ForeignKey(() => Movie)
  @Column({ type: DataType.INTEGER, allowNull: false })
  movieId: number;

  @BelongsTo(() => Movie, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
  })
  movie: Movie;
}