import { BelongsTo, Column, DataType, ForeignKey, Model, Table } from "sequelize-typescript";
import { Review } from "./review.model";

@Table({ tableName: 'comment' })
export class Comment extends Model<Comment> {
  @Column({ type: DataType.BIGINT, primaryKey: true, autoIncrement: true })
  id: string;

  @Column({ type: DataType.TEXT, allowNull: false })
  comment: string;

  @Column({ type: DataType.DATE, allowNull: false })
  date: Date;

  @Column({ type: DataType.STRING, allowNull: false })
  author: string;

  @Column({ field: 'user_id', type: DataType.BIGINT, allowNull: true })
  userId: number;

  @ForeignKey(() => Comment)
  @Column({ field: 'fk_parent_id', type: DataType.BIGINT, allowNull: true })
  parentId: string; // parent comment

  @ForeignKey(() => Review)
  @Column({ field: 'fk_review_id', type: DataType.INTEGER, allowNull: false })
  reviewId: number;

  @BelongsTo(() => Review)
  review: Review;
}