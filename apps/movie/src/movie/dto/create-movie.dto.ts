import { ApiProperty, PartialType } from "@nestjs/swagger";
import { Movie } from "../models/movie.model";
import { IsNotEmpty } from "class-validator";

export class CreateMovieDto extends PartialType(Movie) {
  @ApiProperty({ required: true })
  @IsNotEmpty()
  readonly name: string;

  @ApiProperty({ required: true })
  @IsNotEmpty()
  readonly nameEn: string;
}