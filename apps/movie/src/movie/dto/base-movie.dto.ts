import { ApiProperty } from "@nestjs/swagger";
import { Rating } from "../common/rating";
import { Fee, Fees } from "../common/fee";
import { Premiere } from "../common/premiere";
import { Votes } from "../common/votes";
import { Distributors } from "../common/distributors";
import { Name, Names } from "../common/names";
import { ExternalId } from "../common/external-id";

export class MovieBaseDto {
  @ApiProperty({
    description: 'ID кинопоиска',
    example: 535341
  })
  idkp: number;

  @ApiProperty({
    description: 'Название фильма',
    example: '1+1'
  })
  name: string;

  @ApiProperty({
    description: 'Название фильма на английском',
    example: 'The Intouchables'
  })
  name_en: string;

    @ApiProperty({
      description: 'Год выпуска',
      example: 2011
    })
  year: number;

  @ApiProperty({
    description: 'Описание фильма',
    example: 'Длинное описание фильма...'
  })
  description: string;

  @ApiProperty({
    description: 'Краткое описание фильма',
    example: 'Короткое описание фильма...'
  })
  short_description: string;

  @ApiProperty({
    description: 'Рейтинг',
    example: <Rating>{
      imdb: 8.5,
      kp: 8.805,
      filmCritics: 6.8,
      russianFilmCritics: 100,
      await: 0
    }
  })
  rating: Rating;

  @ApiProperty({
    description: 'Длительность фильма',
    example: 112
  })
  movie_length: number;

  @ApiProperty({
    description: 'Возрастной рейтинг',
    example: 16
  })
  age_rating: number;

  @ApiProperty({
    description: 'Альтернативное название',
    example: 'Intouchables'
  })
  alternative_name: string;

  @ApiProperty({
    description: 'Тип фильма',
    example: 'movie'
  })
  type: string;

  @ApiProperty({
    description: 'Тип фильма (числовое значение)',
    example: 1
  })
  type_number: number;

  @ApiProperty({
    description: 'Слоган фильма',
    example: 'Sometimes you have to reach into someone else\'s world to find out what\'s missing in your own'
  })
  slogan: string;

  @ApiProperty({
    description: 'Сборы',
    example: <Fees>{
      world: <Fee>{
        value: 426588510,
        currency: '$'
      },
      russia: <Fee>{
        value: 1725813,
        currency: '$'
      },
      usa: <Fee>{
        value: 10198820,
        currency: '$'
      }
    }
  })
  fees: Fees;

  @ApiProperty({
    description: 'Премьера',
    example: <Premiere>{
      country: 'Испания',
      world: new Date("2011-09-23T00:00:00.000Z"),
      russia: new Date("2012-04-26T00:00:00.000Z"),
      cinema: new Date("2012-04-26T00:00:00.000Z"),
      dvd: new Date("2013-11-11T00:00:00.000Z"),
      bluray: new Date("2012-06-25T00:00:00.000Z")
    }
  })
  premiere: Premiere;

  @ApiProperty({
    description: 'Количество проголосовавших',
    example: <Votes>{
      imdb: 876090,
      kp: 1566743,
      filmCritics: 130,
      russianFilmCritics: 12,
      await: 15
    }
  })
  votes: Votes;

  @ApiProperty({
    description: 'Бюджет фильма',
    example: <Fee>{
      value: 9500000,
      currency: '$'
    },
  })
  budget: Fee;

  @ApiProperty({
    description: 'Статус фильма',
    example: null
  })
  status: string;

  @ApiProperty({
    description: 'Рейтинг MPAA (Система рейтингов Американской киноассоциации)',
    example: 'r'
  })
  rating_mpaa: string;

  @ApiProperty({
    description: 'Дистрибьюторы',
    example: <Distributors>{
      distributor: 'Каскад Фильм',
      distributorRelease: 'Новый Диск'
    }
  })
  distributors: Distributors;

  @ApiProperty({
    description: 'Названия',
    example: <Names>[
      <Name>{
        name: '1+1'
      },
      <Name>{
        name: 'Intouchables'
      },
      <Name>{
        name: 'Неприкасаемые',
        language: 'RU',
        type: null
      }
    ]
  })
  names: Names;

  @ApiProperty({
    description: 'Внешний ID',
    example: <ExternalId>{
      kpHD: '4127663ed234fa8584aeb969ceb02cd8',
      imdb: 'tt1675434',
      tmdb: '77338'
    }
  })
  external_id: ExternalId;

  @ApiProperty({
    description: 'Топ 10',
    example: null
  })
  top10: number;

  @ApiProperty({
    description: 'Топ 250',
    example: 16
  })
  top250: number;
}