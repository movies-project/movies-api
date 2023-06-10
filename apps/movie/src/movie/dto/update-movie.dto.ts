import { Movie } from "../models/movie.model";
import { IntersectionType, PartialType, PickType } from "@nestjs/swagger";
import { IsString } from "class-validator";

export class UpdateMovieDto extends IntersectionType(
  PickType(Movie, ['name', 'nameEn']),
  PartialType(
    PickType(Movie,['alternativeName'])
  )
) {
  @IsString()
  name: string;

  @IsString()
  nameEn: string;

  @IsString()
  alternativeName: string;
}
