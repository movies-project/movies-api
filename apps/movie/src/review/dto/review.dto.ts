import { ApiProperty } from "@nestjs/swagger";
import { ReviewType } from "../common/review-type";

export class ReviewDto {
  @ApiProperty({
    description: 'Заголовок',
    example: 'КОМЕДИЯ ИЛИ ВСЕ ЖЕ ТРАГЕДИЯ?'
  })
  title: string;

  @ApiProperty({
    description: 'Тип обзора',
    enum: ReviewType
  })
  type: ReviewType;

  @ApiProperty({
    description: 'Обзор',
    example: 'Я никогда не писала рецензии на фильмы, но думаю, что фильм 1+1 будет идеальным началом...'
  })
  review: string;

  @ApiProperty({
    description: 'ID Фильма',
    example: 0
  })
  movieId: number
}