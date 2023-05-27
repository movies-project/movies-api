import {Body, Controller, Get, Param, Put, UseGuards} from '@nestjs/common';
import {ApiTags, ApiOperation, ApiResponse, ApiBearerAuth} from "@nestjs/swagger";

import {GenreService} from "./genre.service";
import {Genre} from "./genre.model";
import {EditGenreDto} from './dto/edit-genre.dto';
import {JwtAuthGuard} from "@app/guards/jwt.guard";
import {NotFoundErrorGenreResponseDto} from "./dto/not-found-error-genre-response.dto";
import {BadRequestErrorGenreResponseDto} from "./dto/bad-request-error-genre-response.dto";
import {ForbiddenErrorResponseDto} from "@app/shared/dto/forbidden-error-response.dto";

// endpoints /genres/

@ApiTags('Жанры')    // документирование swagger
@Controller('genres')    // сделать класс контроллером, обрабатывать запросы на /genres/
export class GenreController {

    constructor(private genreService: GenreService) {   // инъекция GenreService, чтобы использовать сервис внутри контроллера
    }

    @ApiOperation({summary: 'Получить все жанры'})    // документирование swagger
    @ApiResponse({status: 200, type: [Genre]})             // документирование swagger
    @Get()
    getAll() {
        return this.genreService.getAll();            // возвращает результат из сервиса
    }

    @ApiOperation({summary: 'Редактировать жанр по id'})      // документирование swagger
    @ApiResponse({                                            // документирование swagger
        status: 200,
        type: Genre
    })
    @ApiResponse({
        status: 404,
        type: NotFoundErrorGenreResponseDto,
        description: 'Жанр не найден или поля для обновления не переданы'
    })
    @ApiResponse({
        status: 400,
        type: BadRequestErrorGenreResponseDto,
        description: 'Передаваемое значение поля не уникально',
    })
    @ApiResponse({
        status: 403,
        type: ForbiddenErrorResponseDto,
        description: 'Ошибка доступа',
    })
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard('admin'))
    @Put('/:id')
    edit(@Param('id') genreId: number,        // @Param - считываем параметр id
         @Body() genreDto: EditGenreDto) {           // тело запроса получает по схеме EditGenreDto
        return this.genreService.edit(genreId, genreDto)
    }
}
