import { ApiProperty, PartialType } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";
import { MovieBaseDto } from "./base-movie.dto";

export class CreateMovieDto extends PartialType(MovieBaseDto) {
  @ApiProperty({ required: true })
  @IsNotEmpty()
  readonly name: string;

  @ApiProperty({ required: true })
  @IsNotEmpty()
  readonly nameEn: string;
}