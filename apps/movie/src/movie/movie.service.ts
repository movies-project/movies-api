import {
  Inject,
  Injectable,
  InternalServerErrorException,
} from "@nestjs/common";
import {InjectModel} from "@nestjs/sequelize";
import {Repository} from "sequelize-typescript";
import {Op} from "sequelize";
import {OrderItem} from "sequelize/types/model";
import {InjectRedis} from "@liaoliaots/nestjs-redis";
import Redis from "ioredis";

import { MediaSharedService } from "@app/media-shared/media-shared.service";
import { Trailer } from "./models/trailer.model";
import {Movie} from "./models/movie.model";
import {Genre} from "../genre/genre.model";
import {Country} from "../country/country.model";
import {CreateMovieDto} from "./dto/create-movie.dto";
import {UpdateMovieDto} from "./dto/update-movie.dto";
import {redisConfig} from "@app/config/redis.config";
import {FilterMovieDto} from "./dto/filter-movie.dto";
import {ExtendedMovieRepository} from "./extended-movie.repository";
@Injectable()
export class MovieService {

  constructor(
    @InjectModel(Movie)
    private readonly movieRepository: Repository<Movie>,
    @Inject(ExtendedMovieRepository)
    private readonly extendedMovieRepository: ExtendedMovieRepository,
    @InjectRedis(redisConfig.MOVIE_REDIS_NAMESPACE)
    private readonly redis: Redis,
    private readonly mediaSharedService: MediaSharedService

  ) {}

  // Версия данных для ключей Redis
  redisTimestamp: number = Date.now();

  static getBestMoviesRedisKey(timestamp: number) {
    return `bestMovies:${timestamp}`;
  }

  async findOne(id: number): Promise<Movie> {
    id = Number(id)
    return await this.extendedMovieRepository.findOneWithRelations({
      where: {
        id:{
          [Op.eq]: id
        }
      }
    });
  }

  async findRandom(limit?: number): Promise<Movie[]> {
    return await this.extendedMovieRepository.findAllWithRelations({
      order: this.movieRepository.sequelize.random(),
      limit: limit
    });
  }

  async getMovies(filterParams: FilterMovieDto, limit: number, offset: number)
    : Promise<Movie[]> {
    // Копируем объект, чтобы изменения не отразились в других участках кода
    filterParams = {...filterParams};

    const convertToArray = (value: any) => {
      return (value && typeof value === 'string') ? [value] : value;
    }

    const makeFilter = (field: string, op: symbol, value: any) =>
      value ? {
        [field]: {
          [op]: value
        }
      } : undefined;

    // преобразуем одно значение в массив
    filterParams.genreId = convertToArray(filterParams.genreId);
    filterParams.countryId = convertToArray(filterParams.countryId);

    let commonFilters = {
      ...makeFilter(
          'rating.kp',
          Op.gte,       // >=
          Number(filterParams.minRating?.replace(',', '.'))
      ),
      ...makeFilter(
          'votes.kp', Op.gte, Number(filterParams.minVotes)),     // >=
      ...makeFilter(
          'name', Op.startsWith, filterParams.searchString),
    };

    const sortFieldsMap: Record<string, OrderItem> = {
      votes: ['votes.kp', 'DESC'],
      rating: ['rating.kp', 'DESC'],
      year: ['year', 'DESC'],
      name: ['name', 'ASC'],
    };

    let sortBySortField: OrderItem = sortFieldsMap[filterParams.sortField] || ['id', 'ASC'];

    const filteredMovies = await this.movieRepository.findAll({
      where: {
        ...commonFilters
      },
      include: [
        {
          model: Genre,
          where: makeFilter('id', Op.in, filterParams.genreId),
          duplicating: true,      // true - использовать подзапрос, не преобразовать в простой join, для корректной работы limit
          through: {
            attributes: [],      // исключаем поле film_genre из результатов запроса
          },
        },
        {
          model: Country,
          where: makeFilter('id', Op.in, filterParams.countryId),
          duplicating: true,      // true - использовать подзапрос, не преобразовать в простой join, для корректной работы limit
          through: {
            attributes: [],      // исключаем поле film_country из результатов запроса
          },
        }
      ],
      order: [sortBySortField],
      limit: limit,
      offset: offset
    });

    // получаем id из результатов
    const movieIds = filteredMovies.map(movie => movie.id)

    // возвращаем все фильмы с этими id, включая все их жанры и страны
    return this.extendedMovieRepository.findAllWithRelations({
      where: {
        id: {
          [Op.in]: movieIds
        }
      },
    }, false);
  }


  async getBestMovies(limit: number, offset: number): Promise<Movie[]> {
    const bestMoviesRedisKey = MovieService.getBestMoviesRedisKey(this.redisTimestamp);

    // Если ключ не найден, то выбрасываем ошибку
    if (!await this.redis.exists(bestMoviesRedisKey))
      throw new InternalServerErrorException();

    // Получение закэшированных данных из Redis
    const cachedMovies = await this.redis.zrange(bestMoviesRedisKey, offset, offset + limit - 1);

    return cachedMovies.map(movie => JSON.parse(movie));
  }

  async create(data: CreateMovieDto): Promise<Movie> {
    return await this.movieRepository.create(data);
  }

  async update(id: number, data: UpdateMovieDto): Promise<Movie> {
    const [, [updatedMovie]] = await this.movieRepository.update(
      data,
      { where: { id }, returning: true }
    );
    return updatedMovie;
  }

  async delete(id: number): Promise<boolean> {
    return Boolean(
      await this.movieRepository.destroy({ where: { id } })
    );
  }

  async addTrailer(movieId: number, file: Express.Multer.File): Promise<Trailer> {
    const fileModel = await this.mediaSharedService.create('trailer', file);
    return await Trailer.create({
      movieId,
      fileId: fileModel.id
    });
  }

  async getTrailer(movieId: number, trailerId: number, res: Response): Promise<Trailer> {
    const trailer: Trailer = await Trailer.findOne({
      where: {
        movieId,
        id: trailerId
      }
    });
    if (!trailer)
      return;
    await this.mediaSharedService.download(res, 'trailer', trailerId);
    return trailer;
  }

  async getTrailers(movieId: number): Promise<Trailer[]> {
    return await Trailer.findAll({
      where: {
        movieId
      }
    });
  }

}
