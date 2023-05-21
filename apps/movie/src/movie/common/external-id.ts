import { ApiProperty } from "@nestjs/swagger";

export class ExternalId {
  @ApiProperty({
    description: 'ID из Kinopoisk HD',
    example: '48e8d0acb0f62d8585101798eaeceec5'
  })
  kpHD: string;

  @ApiProperty({
    description: 'ID из IMDB',
    example: 'tt0232500'
  })
  imdb: string;

  @ApiProperty({
    description: 'ID из TMDB',
    example: '9799'
  })
  tmdb: string;
}