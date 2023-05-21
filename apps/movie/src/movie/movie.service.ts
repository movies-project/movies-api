import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { Repository } from "sequelize-typescript";
import { MovieModel } from "./models/movie.model";
import { CreateMovieDto } from "./dto/create-movie.dto";
import { UpdateMovieDto } from "./dto/update-movie.dto";
import { apiConfig } from "@app/config/api.config";

@Injectable()
export class MovieService {
  constructor(
    @InjectModel(MovieModel)
    private readonly movieRepository: Repository<MovieModel>
  ) {}

  async findOne(id: number) {
    return await this.movieRepository.findByPk(id);
  }

  async findRandom(limit?: number) {
    limit = Math.max(limit, apiConfig.RANDOM_MOVIES_LIMIT);
    return await this.movieRepository.findAll({
      order: this.movieRepository.sequelize.random(),
      limit: limit
    });
  }

  async create(data: CreateMovieDto) {
    return await this.movieRepository.create(data);
  }

  async update(id: number, data: UpdateMovieDto) {
    return await this.movieRepository.update(data, { where: { id } });
  }

  async delete(id: number) {
    return await this.movieRepository.destroy({ where: { id } });
  }
}
