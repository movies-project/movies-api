import {Model, Table, Column, DataType, BelongsToMany} from "sequelize-typescript";

import { Rating } from "../common/rating";
import { Fee, Fees } from "../common/fee";
import { Premiere } from "../common/premiere";
import { Votes } from "../common/votes";
import { Distributors } from "../common/distributors";
import { Names } from "../common/names";
import { ExternalId } from "../common/external-id";
import {Genre} from "../../genre/genre.model";
import {Country} from "../../country/country.model";

@Table({ tableName: 'film' })
export class Movie extends Model<Movie> {

  @Column({ type: DataType.INTEGER, primaryKey: true, autoIncrement: true })
  id: number;

  @Column({ type: DataType.INTEGER, allowNull: false })
  idkp: number;

  @Column({ type: DataType.STRING, allowNull: false })
  name: string;

  @Column({ field: 'name_en', type: DataType.STRING, allowNull: false })
  nameEn: string;

  @Column({ type: DataType.INTEGER, allowNull: true })
  year: number;

  @Column({ type: DataType.TEXT, allowNull: true })
  description: string;

  @Column({ field: 'short_description', type: DataType.TEXT, allowNull: true })
  shortDescription: string;

  @Column({ type: DataType.JSONB, allowNull: true })
  rating: Rating;

  @Column({ field: 'film_length', type: DataType.INTEGER, allowNull: true })
  movieLength: number;

  @Column({ field: 'age_rating', type: DataType.INTEGER, allowNull: true })
  ageRating: number;

  @Column({ field: 'alternative_name', type: DataType.STRING, allowNull: true })
  alternativeName: string;

  @Column({ type: DataType.STRING, allowNull: true })
  type: string;

  @Column({ field: 'type_number', type: DataType.INTEGER, allowNull: true })
  typeNumber: number;

  @Column({ type: DataType.STRING, allowNull: true })
  slogan: string;

  @Column({ type: DataType.JSONB, allowNull: true })
  fees: Fees;

  @Column({ type: DataType.JSONB, allowNull: true })
  premiere: Premiere;

  @Column({ type: DataType.JSONB, allowNull: true })
  votes: Votes;

  @Column({ type: DataType.JSON, allowNull: true })
  budget: Fee;

  @Column({ type: DataType.STRING, allowNull: true })
  status: string;

  @Column({ field: 'rating_mpaa', type: DataType.STRING, allowNull: true })
  ratingMpaa: string;

  @Column({ type: DataType.JSON, allowNull: true })
  distributors: Distributors;

  @Column({ type: DataType.JSONB, allowNull: true })
  names: Names;

  @Column({ field: 'external_id', type: DataType.JSON, allowNull: true })
  externalId: ExternalId;

  @Column({ type: DataType.INTEGER, allowNull: true })
  top10: number;

  @Column({ type: DataType.INTEGER, allowNull: true })
  top250: number;


  // многие-ко-многим
  // связываем Movie с Genre через таблицу film_genre
  @BelongsToMany(
      () => Genre,
      'film_genre',
      'film_id',
      'genre_id')
  genres: Genre[];           // поле: тип


  // многие-ко-многим
  // связываем Movie с Country через таблицу film_country
  @BelongsToMany(
      () => Country,
      'film_country',
      'film_id',
      'country_id')
  countries: Country[];           // поле: тип

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
