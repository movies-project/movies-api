import { Body, Controller, Get, Param, Put } from '@nestjs/common';
import {
    ApiBadRequestResponse,
    ApiBearerAuth,
    ApiNotFoundResponse,
    ApiOkResponse,
    ApiOperation,
    ApiParam,
    ApiTags
} from "@nestjs/swagger";

import { GenreService } from "./genre.service";
import { Genre } from "./genre.model";
import { EditGenreDto } from './dto/edit-genre.dto';
import { ADMIN_ROLE, JwtAuthGuard } from "@app/auth-shared/session/guards/jwt.guard";
import { SharedModule } from "@app/shared";
import { DuplicateKeyBadRequestException } from "./common/duplicate-key-bad-request-exception";
import { GenreNotFoundException } from "./common/genre-not-found-exception";

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
    getAll() {
        return this.genreService.getAll();            // возвращает результат из сервиса
    }


    @Put('/:id')
    @ApiOperation({summary: 'Редактировать жанр по id'})      // документирование swagger
    @ApiOkResponse({            // 200
        type: Genre
    })
    @ApiNotFoundResponse({      // 404
        type: SharedModule.generateDocsByHttpException(
          new GenreNotFoundException()
        ),
        description: 'Жанр не найден'
    })
    @ApiBadRequestResponse({    // 400
        type: SharedModule.generateDocsByHttpException(
          new DuplicateKeyBadRequestException('key', 'value')
        ),
        description: 'Передаваемое значение поля не уникально' +
            ' или поля для обновления не переданы',
    })
    @ApiParam({
        name: 'id',
        required: true,
        type: Number,
        description: 'Идентификатор жанра'
    })
    @ApiBearerAuth()
    @JwtAuthGuard(ADMIN_ROLE)
    async update(@Param('id') genreId: number,        // @Param - считываем параметр id
                 @Body() genreDto: EditGenreDto): Promise<Genre> {          // тело запроса получает по схеме EditGenreDto
        let genre: Genre;

        try {
            genre = await this.genreService.update(genreId, genreDto);
        } catch (err) {

            // если передаваемое значение поля не уникально
            if (err.name == 'SequelizeUniqueConstraintError') {
                const errorItem = err.errors[0];
                throw new DuplicateKeyBadRequestException(errorItem.path, errorItem.value);
            }
            else {
                console.log(err)
                throw err;
            }
        }

        if (!genre) {
            throw new GenreNotFoundException();
        }

        return genre;
    }
}
