import { PickType} from "@nestjs/swagger";
import { IsEnum, IsNotEmpty } from "class-validator";
import { ReviewType } from "../common/review-type";
import { Review } from "../models/review.model";

export class CreateReviewDto
    extends PickType(Review, ['review', 'title', 'type', 'movieId'])
{
  @IsNotEmpty()
  readonly review: string;

  @IsNotEmpty()
  readonly title: string;

  @IsNotEmpty()
  @IsEnum(ReviewType)
  readonly type: ReviewType;

  @IsNotEmpty()
  readonly movieId: number;
}
