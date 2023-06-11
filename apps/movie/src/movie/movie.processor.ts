import { Inject } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { Process, Processor } from "@nestjs/bull";
import { InjectRedis } from "@liaoliaots/nestjs-redis";
import { Repository } from "sequelize-typescript";
import Redis from "ioredis";
import { Op } from "sequelize";

import { movieProcesses } from "@app/microservices/movie/movie-processes";
import { redisConfig } from "@app/config/redis.config";
import { bullConfig } from "@app/config/bull.config";

import { movieConfig } from "./config/movie.config";
import { MovieService } from "./movie.service";
import { ExtendedMovieRepository } from "./extended-movie.repository";
import { Movie } from "./models/movie.model";

@Processor(bullConfig.BULL_MOVIE_QUEUE)
export class MovieProcessor {
  constructor(
    @InjectModel(Movie)
    private readonly movieRepository: Repository<Movie>,
    @Inject(ExtendedMovieRepository)
    private readonly extendedMovieRepository: ExtendedMovieRepository,
    @InjectRedis(redisConfig.MOVIE_REDIS_NAMESPACE)
    private readonly redis: Redis,
    private readonly movieService: MovieService
  ) {}

  @Process(movieProcesses.CACHE_BEST_MOVIES)
  async cacheBestMovies() {
    // Создание транзакции Redis
    const multi = this.redis.multi();

    const bestMoviesRedisKey = MovieService.getBestMoviesRedisKey(
      this.movieService.redisTimestamp
    );

    // Получение данных из БД
    const currentYear = new Date().getFullYear();
    const movies = await this.extendedMovieRepository.findBestMoviesWithRelations({
      where: {
        year: {
          [Op.gte]: currentYear - 10,
        },
      },
      limit: movieConfig.REDIS_MAX_CACHED_BEST_MOVIES,
    });

    // Сохраяем полученные фильмы в базу данных Redis
    for (const [index, movie] of movies.entries()) {
      multi.zadd(bestMoviesRedisKey, index, JSON.stringify(movie));
    }

    // Делаем ключ валидным только в течении 24 часов
    multi.expire(bestMoviesRedisKey, movieConfig.REDIS_KEY_EXPIRATION_BEST_MOVIES);

    await multi.exec();
  }
}