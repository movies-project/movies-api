import { ApiProperty } from "@nestjs/swagger";
import { IsOptional } from "class-validator";

export class CommentDto {
  @ApiProperty({
    description: 'Комментарий',
    example: 'Не согласен с обзором выше...'
  })
  readonly comment: string;

  @ApiProperty({
    description: 'ID обзора',
    example: 0
  })
  readonly reviewId: number;

  @ApiProperty({
    description: 'ID коментария на который был написан этот ответ',
    example: null
  })
  @IsOptional()
  readonly parentId: string;
}