import {IntersectionType, PartialType, PickType} from "@nestjs/swagger";
import {ReviewType} from "../common/review-type";
import {Review} from "../models/review.model";
import {IsNotEmpty, IsOptional} from "class-validator";

export class CreateReviewDto
    extends IntersectionType(
        PickType(Review, ['review', 'movieId', 'date', 'author']),
        PartialType(
            PickType(Review, ['title', 'type', 'userId'])
        )) {

  @IsOptional()
  readonly title: string;

  @IsOptional()
  readonly type: ReviewType;

  @IsNotEmpty()
  readonly review: string;

  @IsNotEmpty()
  readonly date: Date;

  @IsNotEmpty()
  readonly author: string;

  @IsOptional()
  readonly userId: number;

  @IsNotEmpty()
  readonly movieId: number;
}
