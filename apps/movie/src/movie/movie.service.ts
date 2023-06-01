import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { Repository } from "sequelize-typescript";
import { Movie } from "./models/movie.model";
import { CreateMovieDto } from "./dto/create-movie.dto";
import { UpdateMovieDto } from "./dto/update-movie.dto";
import { apiConfig } from "@app/config/api.config";
import { literal, Op } from "sequelize";
import { InjectRedis } from "@liaoliaots/nestjs-redis";
import { redisConfig } from "@app/config/redis.config";
import Redis from "ioredis";
import { movieConfig } from "./config/movie.config";

@Injectable()
export class MovieService {
  constructor(
    @InjectModel(Movie)
    private readonly movieRepository: Repository<Movie>,
    @InjectRedis(redisConfig.MOVIE_REDIS_NAMESPACE)
    private readonly redis: Redis
  ) {}

  // Версия данных для ключей Redis
  private redisTimestamp: number = Date.now();

  private static getBestMoviesRedisKey(timestamp: number) {
    return `bestMovies:${timestamp}`;
  }

  async findOne(id: number): Promise<Movie> {
    return await this.movieRepository.findByPk(id);
  }

  async findRandom(limit?: number): Promise<Movie[]> {
    return await this.movieRepository.findAll({
      order: this.movieRepository.sequelize.random(),
      limit: limit
    });
  }

  async getMovies(limit: number, offset: number): Promise<Movie[]> {
    return await this.movieRepository.findAll({
      limit,
      offset
    });
  }

  async getBestMovies(limit: number, offset: number): Promise<Movie[]> {
    const bestMoviesRedisKey = MovieService.getBestMoviesRedisKey(this.redisTimestamp);
    if (await this.redis.exists(bestMoviesRedisKey)) {
      // Получение закэшированных данных из Redis
      const cachedMovies = await this.redis.zrange(bestMoviesRedisKey, offset, offset + limit - 1);

      return cachedMovies.map(movie => JSON.parse(movie));
    }

    // Получение данных из БД
    const currentYear = new Date().getFullYear();
    const movies = await this.movieRepository.findAll({
      where: {
        year: {
          [Op.gte]: currentYear - 10
        }
      },
      order: [
        [
          literal(`
            COALESCE(rating.kp, 0) +
            COALESCE(rating.imdb, 0) +
            COALESCE(rating.tmdb, 0) +
            COALESCE(rating.filmCritics, 0) +
            COALESCE(rating.russianFilmCritics, 0) +
            COALESCE(rating.await, 0)
          `),
          'DESC',
        ],
      ],
      limit: movieConfig.REDIS_MAX_CACHED_BEST_MOVIES
    });

    // Сохраяем полученные фильмы в базу данных Redis
    for (const [index, movie] of movies.entries()) {
      await this.redis.zadd(bestMoviesRedisKey, index, JSON.stringify(movie));
    }

    // Делаем ключ валидным только в течении 24 часов
    await this.redis.expire(bestMoviesRedisKey, 60 * 60 * 24);

    return movies.slice(offset, offset + limit);
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
}
