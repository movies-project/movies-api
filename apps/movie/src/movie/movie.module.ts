import { Module } from '@nestjs/common';
import { SequelizeModule } from "@nestjs/sequelize";
import { Movie } from "./models/movie.model";
import { MovieController } from "./movie.controller";
import { MovieService } from "./movie.service";
import { AuthSharedModule } from "@app/auth-shared/auth-shared.module";
import { ExtendedMovieRepository } from "./extended-movie.repository";
import { BullModule } from "@nestjs/bull";
import { bullConfig } from "@app/config/bull.config";
import { MediaSharedModule } from "@app/media-shared/media-shared.module";
import { MovieProcessor } from "./movie.processor";
import { Trailer } from "./models/trailer.model";

@Module({
  imports: [
    SequelizeModule.forFeature([Movie, Trailer]),
    AuthSharedModule,
    MediaSharedModule,
    BullModule.registerQueue(bullConfig.BULL_MOVIE_OPTIONS)
  ],
  controllers: [MovieController],
  providers: [
    MovieService,
    MovieProcessor,
    ExtendedMovieRepository
  ]
})
export class MovieModule {}
