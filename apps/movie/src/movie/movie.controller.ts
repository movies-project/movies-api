import {
    Body,
    Controller,
    Delete,
    Get,
    HttpCode,
    NotFoundException,
    Param, ParseIntPipe,
    Post,
    Put,
    Query,
    UsePipes
} from "@nestjs/common";
import {
    ApiBearerAuth,
    ApiBody,
    ApiCreatedResponse,
    ApiNotFoundResponse,
    ApiOkResponse,
    ApiOperation,
    ApiParam,
    ApiQuery,
    ApiTags
} from "@nestjs/swagger";
import {MovieService} from './movie.service';
import {CreateMovieDto} from "./dto/create-movie.dto";
import {Movie} from "./models/movie.model";
import {UpdateMovieDto} from "./dto/update-movie.dto";
import {ApiNoContentResponse} from "@nestjs/swagger/dist/decorators/api-response.decorator";
import {movieConfig} from "./config/movie.config";
import {LimitValidationPipe} from "@app/pipes/limit-validation.pipe";
import {ADMIN_ROLE, JwtAuthGuard} from "@app/auth-shared/session/guards/jwt.guard";
import { SharedModule } from "@app/shared";
import { MovieNotFoundException } from "./common/movie-not-found-exception";

@ApiTags('Фильмы')
@Controller('movies')
export class MovieController {
    constructor(private readonly movieService: MovieService) {
    }

    @Get('/random')
    @UsePipes(new LimitValidationPipe(
      movieConfig.MOVIE_LIST_LIMIT.minLimit,
      movieConfig.MOVIE_LIST_LIMIT.maxLimit))
    @ApiOperation({summary: 'Получить случайный фильм из БД'})
    @ApiOkResponse({
        description: 'Случайный фильм найден',
        type: [Movie]
    })
    @ApiQuery({name: 'limit', required: true, type: Number, description: 'Количество случайных фильмов'})
    async findRandom(@Query('limit', ParseIntPipe) limit: number): Promise<Movie[]> {
        return await this.movieService.findRandom(limit);
    }

    @Get('/best')
    @UsePipes(new LimitValidationPipe(
      movieConfig.MOVIE_LIST_LIMIT.minLimit,
      movieConfig.MOVIE_LIST_LIMIT.maxLimit))
    @ApiOperation({summary: 'Список лучших фильмов'})
    @ApiOkResponse({
        description: 'Получен список фильмов',
        type: [Movie]
    })
    @ApiQuery({name: 'limit', required: false, type: Number, description: 'Количество возвращенных фильмов'})
    @ApiQuery({name: 'offset', required: false, type: Number, description: 'Количество пропускаемых фильмов'})
    async getBestMovies(@Query('limit', ParseIntPipe) limit: number,
                        @Query('offset',ParseIntPipe) offset: number)
      : Promise<Movie[]>
    {
        return await this.movieService.getBestMovies(limit, offset);
    }

    @Get('/:id')
    @ApiOperation({summary: 'Поиск по id'})
    @ApiOkResponse({
        description: 'Фильм найден',
        type: Movie
    })
    @ApiNotFoundResponse({
        description: 'Фильм не найден',
        type: SharedModule.generateDocsByHttpException(new MovieNotFoundException())
    })
    @ApiParam({name: 'id', required: true, type: Number, description: 'Идентификатор фильма'})
    async findOne(@Param('id') id: number): Promise<Movie> {
        const movie: Movie = await this.movieService.findOne(id);
        if (!movie)
            throw new MovieNotFoundException();
        return movie;
    }

    @Get()
    @UsePipes(new LimitValidationPipe(
        movieConfig.MOVIE_LIST_LIMIT.minLimit,
        movieConfig.MOVIE_LIST_LIMIT.maxLimit))
    @ApiOperation({summary: 'Получить список фильмов'})
    @ApiOkResponse({
        description: 'Получен список фильмов',
        type: [Movie]
    })
    @ApiQuery({
        name: 'genre_id', required: false, type: [Number],
        description: 'Идентификатор жанра'
    })
    @ApiQuery({
        name: 'country_id', required: false, type: [Number],
        description: 'Идентификатор страны'
    })
    @ApiQuery({
        name: 'min_rating', required: false, type: Number, example: '7.3',
        description: 'Рейтинг, начиная от которого искать'
    })
    @ApiQuery({
        name: 'min_votes', required: false, type: Number,
        description: 'Количество оценок, начиная от которого искать'
    })
    @ApiQuery({
        name: 'search_string', required: false, type: String,
        description: 'Строка для поиска названия фильма'
    })
    @ApiQuery({
        name: 'sort_field', required: false, type: String,
        enum: ['votes', 'rating', 'year', 'name'],
        description: 'Поле, по которому нужно отсортировать\n\n' +
          'Доступные поля:\n' +
          '* votes - сортирует по votes.kp по убыванию\n' +
          '* rating - сортирует по rating.kp по убыванию\n' +
          '* year - по убыванию\n' +
          '* name - по алфавиту\n'
    })
    @ApiQuery({
        name: 'limit', required: false, type: Number,
        description: 'Количество возвращаемых фильмов'
    })
    @ApiQuery({
        name: 'offset', required: false, type: Number,
        description: 'Количество пропускаемых фильмов'
    })
    async getMovies(@Query('genre_id') genreIds: string[],
                    @Query('country_id') countryIds: string[],
                    @Query('min_rating') minRating: string,
                    @Query('min_votes') minVotes: string,
                    @Query('search_string') searchString: string,
                    @Query('sort_field') sortField: string,
                    @Query('limit') limit: number,
                    @Query('offset') offset: number): Promise<Movie[]> {
        return await this.movieService.getMovies(
          genreIds, countryIds, minRating,
          minVotes, searchString, sortField, limit, offset);
    }

    @Post()
    @JwtAuthGuard(ADMIN_ROLE)
    @ApiOperation({summary: 'Создать фильм', description: "Требуется роль: admin"})
    @ApiCreatedResponse({
        description: 'Новый фильм успешно создан',
        type: Movie
    })
    @ApiBearerAuth()
    async create(@Body() data: CreateMovieDto): Promise<Movie> {
        return await this.movieService.create(data);
    }

    @Put('/:id')
    @JwtAuthGuard(ADMIN_ROLE)
    @ApiOperation({summary: 'Изменить данные фильма', description: "Требуется роль: admin"})
    @ApiOkResponse({
        description: 'Данные фильма изменены',
        type: Movie
    })
    @ApiNotFoundResponse({
        description: 'Фильм не найден',
        type: SharedModule.generateDocsByHttpException(new MovieNotFoundException())
    })
    @ApiParam({name: 'id', required: true, type: Number, description: 'Идентификатор фильма'})
    @ApiBody({required: true, type: UpdateMovieDto, description: 'Новые данные фильма'})
    @ApiBearerAuth()
    async update(@Param('id') id: number, @Body() data: UpdateMovieDto): Promise<Movie> {
        const movie: Movie = await this.movieService.update(id, data);
        if (!movie)
            throw new NotFoundException('Фильм не найден');
        return movie;
    }

    @Delete('/:id')
    @HttpCode(204)
    @JwtAuthGuard(ADMIN_ROLE)
    @ApiOperation({summary: 'Удалить фильм', description: "Требуется роль: admin"})
    @ApiNoContentResponse({description: 'Фильм удален'})
    @ApiNotFoundResponse({
        description: 'Фильм не найден',
        type: SharedModule.generateDocsByHttpException(new MovieNotFoundException())
    })
    @ApiParam({name: 'id', required: true, type: Number, description: 'Идентификатор фильма'})
    @ApiBearerAuth()
    async delete(@Param('id') id: number): Promise<void> {
        const result: boolean = await this.movieService.delete(id);
        if (!result)
            throw new MovieNotFoundException();
    }
}
