import { BelongsTo, Column, DataType, ForeignKey, Model, Table } from "sequelize-typescript";
import { ReviewModel } from "./review.model";

@Table({ tableName: 'comment' })
export class CommentModel extends Model<CommentModel> {
  @Column({ type: DataType.BIGINT, primaryKey: true, autoIncrement: true })
  id: number;

  @Column({ type: DataType.TEXT, allowNull: false })
  comment: string;

  @Column({ type: DataType.DATE, allowNull: false })
  date: Date;

  @Column({ type: DataType.STRING, allowNull: false })
  author: string;

  @Column({ field: 'user_id', type: DataType.BIGINT, allowNull: true })
  userId: number;

  @ForeignKey(() => CommentModel)
  @Column({ field: 'fk_parent_id', type: DataType.BIGINT, allowNull: true })
  parentId: number; // parent comment

  @ForeignKey(() => ReviewModel)
  @Column({ field: 'fk_review_id', type: DataType.INTEGER, allowNull: false })
  reviewId: number;

  @BelongsTo(() => ReviewModel)
  review: ReviewModel;
}