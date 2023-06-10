import {Model, Table, Column, DataType, BelongsToMany} from "sequelize-typescript";

import { Rating } from "../common/rating";
import { Fee, Fees } from "../common/fee";
import { Premiere } from "../common/premiere";
import { Votes } from "../common/votes";
import { Distributors } from "../common/distributors";
import { Name, Names } from "../common/names";
import { ExternalId } from "../common/external-id";
import {Genre} from "../../genre/genre.model";
import {Country} from "../../country/country.model";
import { ApiProperty, getSchemaPath } from "@nestjs/swagger";

@Table({
  tableName: 'film',
  defaultScope: {
    attributes: { exclude: ['idkp']}
  }
})
export class Movie extends Model<Movie> {

  @ApiProperty({
    example: '0',
    description: 'Идентификатор фильма',
  })
  @Column({ type: DataType.INTEGER, primaryKey: true, autoIncrement: true })
  id: number;

  @Column({ type: DataType.INTEGER, allowNull: true })
  idkp: number;

  @ApiProperty({
    description: 'Название фильма',
    example: '1+1'
  })
  @Column({ type: DataType.STRING, allowNull: false })
  name: string;

  @ApiProperty({
    description: 'Название фильма на английском',
    example: 'The Intouchables'
  })
  @Column({ field: 'name_en', type: DataType.STRING, allowNull: false })
  nameEn: string;

  @ApiProperty({
    description: 'Год выпуска',
    example: 2011
  })
  @Column({ type: DataType.INTEGER, allowNull: true })
  year: number;

  @ApiProperty({
    description: 'Описание фильма',
    example: 'Длинное описание фильма...'
  })
  @Column({ type: DataType.TEXT, allowNull: true })
  description: string;

  @ApiProperty({
    description: 'Краткое описание фильма',
    example: 'Короткое описание фильма...'
  })
  @Column({ field: 'short_description', type: DataType.TEXT, allowNull: true })
  shortDescription: string;

  @ApiProperty({
    description: 'Рейтинг',
    type: Rating
  })
  @Column({ type: DataType.JSONB, allowNull: true })
  rating: Rating;

  @ApiProperty({
    description: 'Длительность фильма',
    example: 112
  })
  @Column({ field: 'film_length', type: DataType.INTEGER, allowNull: true })
  movieLength: number;

  @ApiProperty({
    description: 'Возрастной рейтинг',
    example: 16
  })
  @Column({ field: 'age_rating', type: DataType.INTEGER, allowNull: true })
  ageRating: number;

  @ApiProperty({
    description: 'Альтернативное название',
    example: 'Intouchables'
  })
  @Column({ field: 'alternative_name', type: DataType.STRING, allowNull: true })
  alternativeName: string;

  @ApiProperty({
    description: 'Тип фильма',
    example: 'movie'
  })
  @Column({ type: DataType.STRING, allowNull: true })
  type: string;

  @ApiProperty({
    description: 'Тип фильма (числовое значение)',
    example: 1
  })
  @Column({ field: 'type_number', type: DataType.INTEGER, allowNull: true })
  typeNumber: number;

  @ApiProperty({
    description: 'Слоган фильма',
    example: 'Sometimes you have to reach into someone else\'s world to find out what\'s missing in your own'
  })
  @Column({ type: DataType.STRING, allowNull: true })
  slogan: string;

  @ApiProperty({
    description: 'Сборы',
    type: Object,
    additionalProperties: {
      $ref: getSchemaPath(Fee)
    },
    example: <Fees>{
      world: <Fee>{ value: 426588510, currency: '$' },
      russia: <Fee>{ value: 1725813, currency: '$' },
      usa: <Fee>{ value: 10198820, currency: '$' }
    }
  })
  @Column({ type: DataType.JSONB, allowNull: true })
  fees: Fees;

  @ApiProperty({
    description: 'Премьера',
    type: Premiere
  })
  @Column({ type: DataType.JSONB, allowNull: true })
  premiere: Premiere;

  @ApiProperty({
    description: 'Количество проголосовавших',
    type: Votes
  })
  @Column({ type: DataType.JSONB, allowNull: true })
  votes: Votes;

  @ApiProperty({
    description: 'Бюджет фильма',
    type: Fee
  })
  @Column({ type: DataType.JSON, allowNull: true })
  budget: Fee;

  @ApiProperty({
    description: 'Статус фильма',
    example: null
  })
  @Column({ type: DataType.STRING, allowNull: true })
  status: string;

  @ApiProperty({
    description: 'Рейтинг MPAA (Система рейтингов Американской киноассоциации)',
    example: 'r'
  })
  @Column({ field: 'rating_mpaa', type: DataType.STRING, allowNull: true })
  ratingMpaa: string;

  @ApiProperty({
    description: 'Дистрибьюторы',
    type: Distributors
  })
  @Column({ type: DataType.JSON, allowNull: true })
  distributors: Distributors;

  @ApiProperty({
    description: 'Названия',
    type: Name,
    isArray: true,
    example: <Names>[
      <Name>{ name: '1+1' },
      <Name>{ name: 'Intouchables' },
      <Name>{ name: 'Неприкасаемые', language: 'RU' }
    ]
  })
  @Column({ type: DataType.JSONB, allowNull: true })
  names: Names;

  @ApiProperty({
    description: 'Внешний ID',
    type: ExternalId
  })
  @Column({ field: 'external_id', type: DataType.JSON, allowNull: true })
  externalId: ExternalId;

  @ApiProperty({
    description: 'Топ 10',
    example: null
  })
  @Column({ type: DataType.INTEGER, allowNull: true })
  top10: number;

  @ApiProperty({
    description: 'Топ 250',
    example: 16
  })
  @Column({ type: DataType.INTEGER, allowNull: true })
  top250: number;


  @ApiProperty({
    description: 'Жанры',
    type: Genre,
    example: [{
      "id": 1,
      "name": "фантастика",
      "name_en": "fantastic"
    }]
  })
  // многие-ко-многим
  // связываем Movie с Genre через таблицу film_genre
  @BelongsToMany(
      () => Genre,
      'film_genre',
      'film_id',
      'genre_id')
  genres: Genre[];           // поле: тип


  @ApiProperty({
    description: 'Страны',
    type: Country,
    example: [{
        "id": 1,
        "name": "Австралия",
        "name_en": "Australia"
      }]
  })
  // многие-ко-многим
  // связываем Movie с Country через таблицу film_country
  @BelongsToMany(
      () => Country,
      'film_country',
      'film_id',
      'country_id')
  countries: Country[];           // поле: тип

  @ApiProperty({
    description: 'Связанные фильмы',
    type: Movie,
    example: [{
      "id": 1,
      "name": "Простая история",
      "nameEn": "The Straight Story",
      "alternativeName": "The Straight Story",
      "type": "tv-series"
    }]
  })
  // многие-ко-многим
  // связываем Movie с Movie через таблицу film_similar_film
  @BelongsToMany(
      () => Movie,
      'film_similar_film',
      'film_id',
      'similar_film_id')
  similarMovies: Movie[];           // поле: тип

  /*
  @ForeignKey(() => Poster)
  @Column({ type: DataType.INTEGER, allowNull: false })
  fk_poster_id: number;

  @ForeignKey(() => Backdrop)
  @Column({ type: DataType.INTEGER, allowNull: false })
  fk_backdrop_id: number;

  @ForeignKey(() => Logo)
  @Column({ type: DataType.INTEGER, allowNull: false })
  fk_logo_id: number;
  */
}
