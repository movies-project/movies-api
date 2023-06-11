import {PickType} from "@nestjs/swagger";
import {IsNotEmpty, IsOptional} from "class-validator";
import {Comment} from "../models/comment.model";

export class CreateCommentDto
  extends PickType(Comment, ['comment', 'parentId'])
{
  @IsNotEmpty()
  readonly comment: string;

  @IsOptional()
  readonly parentId: string;
}
