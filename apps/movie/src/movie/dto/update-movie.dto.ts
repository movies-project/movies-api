import { Movie } from "../models/movie.model";
import { IntersectionType, PartialType, PickType } from "@nestjs/swagger";

export class UpdateMovieDto extends IntersectionType(
  PickType(Movie, ['name', 'nameEn']),
  PartialType(
    PickType(Movie,['alternativeName'])
  )
) {}
