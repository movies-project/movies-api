import { ApiProperty } from "@nestjs/swagger";

export class Rating {
  @ApiProperty({
    description: 'Рейтинг кинопоиска',
    example: '6.2'
  })
  kp: number;

  @ApiProperty({
    description: 'Рейтинг IMDB',
    example: '8.4'
  })
  imdb: number;

  @ApiProperty({
    description: 'Рейтинг TMDB',
    example: '3.2'
  })
  tmdb: number;

  @ApiProperty({
    description: 'Рейтинг кинокритиков',
    example: '10'
  })
  filmCritics: number;

  @ApiProperty({
    description: 'Рейтинг кинокритиков из РФ',
    example: '5.1'
  })
  russianFilmCritics: number;

  @ApiProperty({
    description: 'Рейтинг основанный на ожиданиях пользователей',
    example: '6.1'
  })
  await: number;
}