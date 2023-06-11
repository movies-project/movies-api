import {IntersectionType, PartialType, PickType} from "@nestjs/swagger";
import {IsNotEmpty, IsOptional} from "class-validator";
import {Comment} from "../models/comment.model";

export class CommentDto extends IntersectionType(
    PickType(Comment, ['comment']),
    PartialType(
        PickType(Comment, ['parentId'])
    )) {

  @IsNotEmpty()
  readonly comment: string;

  @IsOptional()
  readonly parentId: string;
}
