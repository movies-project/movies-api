import { Model, Table, Column, DataType } from "sequelize-typescript";
import { Rating } from "../common/rating";
import { Fee, Fees } from "../common/fee";
import { Premiere } from "../common/premiere";
import { Votes } from "../common/votes";
import { Distributors } from "../common/distributors";
import { Names } from "../common/names";
import { ExternalId } from "../common/external-id";

@Table({ tableName: 'movie' })
export class MovieModel extends Model<MovieModel> {
  @Column({ type: DataType.INTEGER, primaryKey: true, autoIncrement: true })
  id: number;

  @Column({ type: DataType.INTEGER, allowNull: false })
  idkp: number;

  @Column({ type: DataType.STRING, allowNull: false })
  name: string;

  @Column({ type: DataType.STRING, allowNull: false })
  name_en: string;

  @Column({ type: DataType.INTEGER, allowNull: true })
  year: number;

  @Column({ type: DataType.TEXT, allowNull: true })
  description: string;

  @Column({ type: DataType.TEXT, allowNull: true })
  short_description: string;

  @Column({ type: DataType.JSONB, allowNull: true })
  rating: Rating;

  @Column({ type: DataType.INTEGER, allowNull: true })
  movie_length: number;

  @Column({ type: DataType.INTEGER, allowNull: true })
  age_rating: number;

  @Column({ type: DataType.STRING, allowNull: true })
  alternative_name: string;

  @Column({ type: DataType.STRING, allowNull: true })
  type: string;

  @Column({ type: DataType.INTEGER, allowNull: true })
  type_number: number;

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

  @Column({ type: DataType.STRING, allowNull: true })
  rating_mpaa: string;

  @Column({ type: DataType.JSON, allowNull: true })
  distributors: Distributors;

  @Column({ type: DataType.JSONB, allowNull: true })
  names: Names;

  @Column({ type: DataType.JSON, allowNull: true })
  external_id: ExternalId;

  @Column({ type: DataType.INTEGER, allowNull: true })
  top10: number;

  @Column({ type: DataType.INTEGER, allowNull: true })
  top250: number;

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