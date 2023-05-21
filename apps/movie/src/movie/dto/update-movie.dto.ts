import { PartialType } from "@nestjs/swagger";
import { MovieBaseDto } from "./base-movie.dto";

export class UpdateMovieDto extends PartialType(MovieBaseDto) {}