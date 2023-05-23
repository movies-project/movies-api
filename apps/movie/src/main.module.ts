import { Module } from '@nestjs/common';
import { MovieModule } from "./movie/movie.module";
import { ReviewModule } from "./review/review.module";
import { SequelizeModule } from "@nestjs/sequelize";
import { postgresConfig } from "@app/config";

@Module({
  imports: [
    SequelizeModule.forRoot(postgresConfig.MOVIE_DB_OPTIONS),
    MovieModule,
    ReviewModule,
  ],
  controllers: [],
  providers: [],
})
export class MainModule {}
