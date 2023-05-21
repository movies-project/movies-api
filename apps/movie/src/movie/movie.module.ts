import { Module } from '@nestjs/common';
import { SequelizeModule } from "@nestjs/sequelize";
import { postgresConfig } from "@app/config";
import { MovieModel } from "./models/movie.model";
import { MovieController } from "./movie.controller";
import { MovieService } from "./movie.service";

@Module({
  imports: [
    SequelizeModule.forRoot(postgresConfig.SEQUELIZE_OPTIONS),
    SequelizeModule.forFeature([MovieModel])
  ],
  controllers: [MovieController],
  providers: [MovieService],
})
export class MovieModule {}
