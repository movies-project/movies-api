import { ApiProperty } from "@nestjs/swagger";
import { BelongsTo, Column, DataType, ForeignKey, HasMany, Model, Table } from "sequelize-typescript";
import { Movie } from "../../movie/models/movie.model";
import { ReviewType } from "../common/review-type";
import { Comment } from "./comment.model";


@Table({
  tableName: 'review',
  defaultScope: {
    attributes: {exclude: ['idkp', 'movieIdkp', 'movie']}
  }
})
export class Review extends Model<Review> {

  @ApiProperty({      // документирование swagger, Response Schema
    description: 'Уникальный идентификатор',
    example: '1'
  })
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
    autoIncrement: true
  })
  id: number;


  @Column({
    type: DataType.INTEGER,
    allowNull: true
  })
  idkp: number;

  @Column({
    field: 'film_idkp',
    type: DataType.INTEGER,
    allowNull: true
  })
  movieIdkp: number;


  @ApiProperty({
    description: 'Заголовок',
    example: 'КОМЕДИЯ ИЛИ ВСЕ ЖЕ ТРАГЕДИЯ?'
  })
  @Column({
    type: DataType.STRING,
    allowNull: true
  })
  title: string;


  @ApiProperty({
    description: 'Тип отзыва',
    enum: ReviewType
  })
  @Column({
    type: DataType.STRING,
    allowNull: true
  })
  type: ReviewType;


  @ApiProperty({
    description: 'Отзыв на фильм',
    example: 'Я никогда не писала рецензии на фильмы, но думаю, что фильм 1+1 будет идеальным началом...'
  })
  @Column({
    type: DataType.TEXT,
    allowNull: false
  })
  review: string;


  @ApiProperty({
    description: 'Дата создания отзыва',
    example: '2023-04-14T02:59:22.000Z'
  })
  @Column({
    type: DataType.DATE,
    allowNull: false
  })
  date: Date;


  @ApiProperty({
    description: 'Автор',
    example: 'Маша Медведева'
  })
  @Column({
    type: DataType.STRING,
    allowNull: false
  })
  author: string;


  @ApiProperty({
    description: 'Идентификатор пользователя',
    example: 1
  })
  @Column({
    field: 'user_id',
    type: DataType.BIGINT,
    allowNull: true
  })
  userId: number;


  @ApiProperty({
    description: 'ID Фильма',
    example: 0
  })
  @ForeignKey(() => Movie)
  @Column({
    field: 'fk_film_id',
    type: DataType.INTEGER,
    allowNull: false
  })
  movieId: number;


  @ApiProperty({
    description: 'Комментарии',
    type: [Comment]
  })
  @HasMany(
      () => Comment,
      'fk_review_id')
  comments: Comment[];

  @BelongsTo(() => Movie, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
  })
  movie: Movie;
}
