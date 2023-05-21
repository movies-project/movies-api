import { ApiProperty } from "@nestjs/swagger";

export class Votes {
  @ApiProperty({
    description: 'Количество голосов на кинопоиске',
    example: '60000'
  })
  kp: number;

  @ApiProperty({
    description: 'Количество голосов на IMDB',
    example: '50000'
  })
  imdb: number;

  @ApiProperty({
    description: 'Количество голосов на TMDB',
    example: '10000'
  })
  tmdb: number;

  @ApiProperty({
    description: 'Количество голосов кинокритиков',
    example: '10000'
  })
  filmCritics: number;

  @ApiProperty({
    description: 'Количество голосов кинокритиков из РФ',
    example: '4000'
  })
  russianFilmCritics: number;

  @ApiProperty({
    description: 'Количество ожидающих выхода',
    example: '34000'
  })
  await: number;
}