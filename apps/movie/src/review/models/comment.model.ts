import { BelongsTo, Column, DataType, ForeignKey, Model, Table } from "sequelize-typescript";
import { Review } from "./review.model";
import {ApiProperty} from "@nestjs/swagger";

@Table({ tableName: 'comment',
  defaultScope: {
    attributes: {exclude: ['review']}
  } })
export class Comment extends Model<Comment> {

  @ApiProperty({
    description: 'Уникальный идентификатор комментария',
    example: '1'
  })
  @Column({ type: DataType.BIGINT, primaryKey: true, autoIncrement: true })
  id: string;


  @ApiProperty({
    description: 'Комментарий',
    example: 'Не согласен с отзывом выше...'
  })
  @Column({ type: DataType.TEXT, allowNull: false })
  comment: string;


  @Column({ type: DataType.DATE, allowNull: false })
  date: Date;

  @Column({ type: DataType.STRING, allowNull: false })
  author: string;

  @Column({ field: 'user_id', type: DataType.BIGINT, allowNull: true })
  userId: number;

  @ApiProperty({
    description: 'ID комментария, на который был написан этот ответ',
    example: null
  })
  @ForeignKey(() => Comment)
  @Column({ field: 'fk_parent_id', type: DataType.BIGINT, allowNull: true })
  parentId: string; // parent comment

  @ApiProperty({
    description: 'ID отзыва',
    example: 0
  })
  @ForeignKey(() => Review)
  @Column({ field: 'fk_review_id', type: DataType.INTEGER, allowNull: false })
  reviewId: number;

  @BelongsTo(() => Review, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
  })
  review: Review;
}
