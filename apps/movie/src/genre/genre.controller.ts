import {BadRequestException, Body, Controller, Get, NotFoundException, Param, Put, UseGuards} from '@nestjs/common';
import {
    ApiBadRequestResponse,
    ApiBearerAuth,
    ApiForbiddenResponse,
    ApiNotFoundResponse,
    ApiOkResponse,
    ApiOperation,
    ApiParam,
    ApiTags
} from "@nestjs/swagger";

import {GenreService} from "./genre.service";
import {Genre} from "./genre.model";
import {EditGenreDto} from './dto/edit-genre.dto';
import {ADMIN_ROLE, JwtAuthGuard} from "@app/guards/jwt.guard";
import {NotFoundErrorGenreResponseDto} from "./dto/not-found-error-genre-response.dto";
import {BadRequestErrorGenreResponseDto} from "./dto/bad-request-error-genre-response.dto";
import {ForbiddenErrorResponseDto} from "@app/shared/dto/forbidden-error-response.dto";

// endpoints /genres/

@ApiTags('Жанры')    // документирование swagger
@Controller('genres')    // сделать класс контроллером, обрабатывать запросы на /genres/
export class GenreController {

    constructor(private genreService: GenreService) {   // инъекция GenreService, чтобы использовать сервис внутри контроллера
    }

    @Get()
    @ApiOperation({summary: 'Получить все жанры'})    // документирование swagger
    @ApiOkResponse({            // 200
        type: [Genre]
    })
    async getAll(): Promise<Genre[]> {
        return this.genreService.getAll();            // возвращает результат из сервиса
    }


    @Put('/:id')
    @ApiOperation({summary: 'Редактировать жанр по id'})      // документирование swagger
    @ApiOkResponse({            // 200
        type: Genre
    })
    @ApiNotFoundResponse({      // 404
        type: NotFoundErrorGenreResponseDto,
        description: 'Жанр не найден'
    })
    @ApiBadRequestResponse({    // 400
        type: BadRequestErrorGenreResponseDto,
        description: 'Передаваемое значение поля не уникально' +
            ' или поля для обновления не переданы',
    })
    @ApiForbiddenResponse({     // 403
        type: ForbiddenErrorResponseDto,
        description: 'Ошибка доступа',
    })
    @ApiParam({
        name: 'id',
        required: true,
        type: Number,
        description: 'Идентификатор жанра'
    })
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard(ADMIN_ROLE))
    async update(@Param('id') genreId: number,        // @Param - считываем параметр id
                 @Body() genreDto: EditGenreDto): Promise<Genre> {          // тело запроса получает по схеме EditGenreDto
        let genre: Genre;

        try {
            genre = await this.genreService.update(genreId, genreDto);
        } catch (err) {

            // если передаваемое значение поля не уникально
            if (err.name == 'SequelizeUniqueConstraintError') {
                const errorItem = err.errors[0]
                throw new BadRequestException([`Ключ (${errorItem.path})=(${errorItem.value}) уже существует`]);
            }
            else {
                console.log(err)
                throw err;
            }
        }

        if (!genre) {
            throw new NotFoundException('Жанр с указанным id не найден');
        }

        return genre;
    }
}
