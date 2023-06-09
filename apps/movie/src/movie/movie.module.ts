import { Module } from '@nestjs/common';
import { SequelizeModule } from "@nestjs/sequelize";
import { Movie } from "./models/movie.model";
import { MovieController } from "./movie.controller";
import { MovieService } from "./movie.service";
import { AuthSharedModule } from "@app/auth-shared/auth-shared.module";
import { ExtendedMovieRepository } from "./extended-movie.repository";

@Module({
  imports: [
    SequelizeModule.forFeature([Movie]),
    AuthSharedModule
  ],
  controllers: [MovieController],
  providers: [MovieService, ExtendedMovieRepository]
})
export class MovieModule {}
