import { PickType } from "@nestjs/swagger";
import { Genre } from "../genre.model";

export class EditGenreDto
  extends PickType(Genre, ['name', 'name_en']) {}
