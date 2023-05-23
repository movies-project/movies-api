import { Body, Controller, Delete, Get, Param, Post, Put, Query } from "@nestjs/common";
import { ApiCreatedResponse, ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { MovieService } from './movie.service';
import { CreateMovieDto } from "./dto/create-movie.dto";
import { Movie } from "./models/movie.model";
import { UpdateMovieDto } from "./dto/update-movie.dto";

@ApiTags('Фильмы')
@Controller('movie')
export class MovieController {
  constructor(private readonly movieService: MovieService) {}

  @Get(':id')
  @ApiOperation({ summary: 'Поиск по id' })
  @ApiResponse({ description: 'Фильм найден' })
  async findOne(@Param('id') id: number): Promise<Movie> {
    return await this.movieService.findOne(id);
  }

  @Get('random')
  @ApiOperation({ summary: 'Получить случайный фильм из БД'})
  @ApiResponse({ description: 'Случайный фильм найден' })
  async findRandom(@Query('limit') limit: number): Promise<Movie[]> {
    return await this.movieService.findRandom(limit);
  }

  @Post()
  @ApiOperation({ summary: 'Создать фильм' })
  @ApiCreatedResponse({ description: 'Новый фильм успешно создан' })
  async create(@Body() data: CreateMovieDto) {
    return await this.movieService.create(data);
  }

  @Put()
  @ApiOperation({ summary: 'Изменить данные фильма' })
  @ApiResponse({ description: 'Данные фильмы изменены' })
  async update(@Body() data: {id: number; newData: UpdateMovieDto}) {
    return await this.movieService.update(data.id, data.newData);
  }

  @Delete()
  @ApiOperation({ summary: 'Удалить фильм' })
  @ApiResponse({ description: 'Фильм удален' })
  async delete(@Body() data: { id: number }) {
    return await this.movieService.delete(data.id);
  }
}
