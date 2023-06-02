import { Module } from '@nestjs/common';
import { MovieModule } from "./movie/movie.module";
import { ReviewModule } from "./review/review.module";
import { SequelizeModule } from "@nestjs/sequelize";
import { postgresConfig } from "@app/config";
import { RedisModule } from "@liaoliaots/nestjs-redis";
import { redisConfig } from "@app/config/redis.config";
import { GenreModule } from "./genre/genre.module";
import { CountryModule } from './country/country.module';

@Module({
  imports: [
    SequelizeModule.forRoot(postgresConfig.MOVIE_DB_OPTIONS),
    RedisModule.forRoot(redisConfig.REDIS_MOVIE_OPTIONS),
    MovieModule,
    ReviewModule,
    GenreModule,
    CountryModule
  ],
  controllers: [],
  providers: [],
})
export class MainModule {}