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
  readonly idkp: number;

  @ApiProperty({
    description: 'Название фильма',
    example: '1+1'
  })
  readonly name: string;

  @ApiProperty({
    description: 'Название фильма на английском',
    example: 'The Intouchables'
  })
  readonly nameEn: string;

  @ApiProperty({
    description: 'Год выпуска',
    example: 2011
  })
  readonly year: number;

  @ApiProperty({
    description: 'Описание фильма',
    example: 'Длинное описание фильма...'
  })
  readonly description: string;

  @ApiProperty({
    description: 'Краткое описание фильма',
    example: 'Короткое описание фильма...'
  })
  readonly shortDescription: string;

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
  readonly rating: Rating;

  @ApiProperty({
    description: 'Длительность фильма',
    example: 112
  })
  readonly movieLength: number;

  @ApiProperty({
    description: 'Возрастной рейтинг',
    example: 16
  })
  readonly ageRating: number;

  @ApiProperty({
    description: 'Альтернативное название',
    example: 'Intouchables'
  })
  readonly alternativeName: string;

  @ApiProperty({
    description: 'Тип фильма',
    example: 'movie'
  })
  readonly type: string;

  @ApiProperty({
    description: 'Тип фильма (числовое значение)',
    example: 1
  })
  readonly typeNumber: number;

  @ApiProperty({
    description: 'Слоган фильма',
    example: 'Sometimes you have to reach into someone else\'s world to find out what\'s missing in your own'
  })
  readonly slogan: string;

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
  readonly fees: Fees;

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
  readonly premiere: Premiere;

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
  readonly votes: Votes;

  @ApiProperty({
    description: 'Бюджет фильма',
    example: <Fee>{
      value: 9500000,
      currency: '$'
    },
  })
  readonly budget: Fee;

  @ApiProperty({
    description: 'Статус фильма',
    example: null
  })
  readonly status: string;

  @ApiProperty({
    description: 'Рейтинг MPAA (Система рейтингов Американской киноассоциации)',
    example: 'r'
  })
  readonly ratingMpaa: string;

  @ApiProperty({
    description: 'Дистрибьюторы',
    example: <Distributors>{
      distributor: 'Каскад Фильм',
      distributorRelease: 'Новый Диск'
    }
  })
  readonly distributors: Distributors;

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
  readonly names: Names;

  @ApiProperty({
    description: 'Внешний ID',
    example: <ExternalId>{
      kpHD: '4127663ed234fa8584aeb969ceb02cd8',
      imdb: 'tt1675434',
      tmdb: '77338'
    }
  })
  readonly externalId: ExternalId;

  @ApiProperty({
    description: 'Топ 10',
    example: null
  })
  readonly top10: number;

  @ApiProperty({
    description: 'Топ 250',
    example: 16
  })
  readonly top250: number;
}