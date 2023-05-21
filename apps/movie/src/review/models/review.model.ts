import { Column, DataType, ForeignKey, HasMany, Model, Table } from "sequelize-typescript";
import { MovieModel } from "../../movie/models/movie.model";
import { ReviewType } from "../common/review-type";
import { CommentModel } from "./comment.model";

@Table({ tableName: 'review' })
export class ReviewModel extends Model<ReviewModel> {
  @Column({ type: DataType.INTEGER, primaryKey: true, autoIncrement: true })
  id: number;

  @Column({ type: DataType.INTEGER, allowNull: true })
  idkp: number;

  @Column({ field: 'movie_idkp', type: DataType.INTEGER, allowNull: true })
  movieIdkp: number;

  @Column({ type: DataType.STRING, allowNull: false })
  title: string;

  @Column({ type: DataType.STRING, allowNull: false })
  type: ReviewType;

  @Column({ type: DataType.TEXT, allowNull: false })
  review: string;

  @Column({ type: DataType.DATE, allowNull: false })
  date: Date;

  @Column({ type: DataType.STRING, allowNull: false })
  author: string;

  @Column({ type: DataType.BIGINT, allowNull: true })
  userId: number;

  @ForeignKey(() => MovieModel)
  @Column({ field: 'fk_film_id', type: DataType.INTEGER, allowNull: false })
  movieId: number;

  @HasMany(() => CommentModel, 'fk_review_id')
  comments: CommentModel[];
}