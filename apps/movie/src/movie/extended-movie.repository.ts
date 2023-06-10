import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { Repository } from "sequelize-typescript";
import { Attributes, FindOptions, Includeable, OrderItem } from "sequelize/types/model";
import { Movie } from "./models/movie.model";
import { literal } from "sequelize";

@Injectable()
export class ExtendedMovieRepository {
  constructor(
    @InjectModel(Movie)
    private readonly repository: Repository<Movie>
  ) {
  }

  async findAllWithRelations(options: FindOptions<Attributes<Movie>>, duplicating = true)
    : Promise<Movie[]>
  {
    const fieldsUpdatedAtCreatedAt = ['updatedAt', 'createdAt']
    const includeOptions = <Includeable[]>[
      {
        all: true, // добавить все поля всех моделей, которые связаны
        attributes: {exclude: [].concat(fieldsUpdatedAtCreatedAt)}, // исключить поля
        through: {
          attributes: [], // исключаем поля с промежуточными таблицами
        },
        duplicating: duplicating // false - не использовать подзапрос, преобразовать в простой join
      },
      {
        // отдельная настройка для similarMovies
        model: Movie,
        duplicating: true, // true - использовать подзапрос, не преобразовать в простой join, для корректной работы limit
        attributes: ['id', 'name', 'nameEn', 'alternativeName', 'type'],
        through: {
          attributes: [],  // исключаем поле film_similar_film из результатов запроса
        },
      }
    ];
    // объединяем includeOptions и options.include из аргументов
    options.include = includeOptions.concat(options.include ?? []);
    options.attributes = {exclude: [].concat(fieldsUpdatedAtCreatedAt)}    // исключить поля
    return this.repository.findAll(options);
  }

  async findOneWithRelations(options: FindOptions<Attributes<Movie>>)
    : Promise<Movie>
  {
    const movies = await this.findAllWithRelations(options);
    if (movies)
      return movies[0];
  }

  async findBestMoviesWithRelations(options: FindOptions<Attributes<Movie>>)
    : Promise<Movie[]>
  {
    const orderOptions = <OrderItem[]>[[
      literal(`
        COALESCE("Movie".rating->>'kp', '0')::numeric +
        COALESCE("Movie".rating->>'imdb', '0')::numeric +
        COALESCE("Movie".rating->>'tmdb', '0')::numeric +
        COALESCE("Movie".rating->>'filmCritics', '0')::numeric +
        COALESCE("Movie".rating->>'russianFilmCritics', '0')::numeric / 10.0 +
        COALESCE("Movie".rating->>'await', '0')::numeric / 10.0
      `),
      'DESC'
    ]];
    // объединяем orderOptions и options.order из аргументов
    options.order = orderOptions.concat(options.order ?? []);
    return this.findAllWithRelations(options);
  }
}
