import {HttpException, HttpStatus, Injectable, NotFoundException} from '@nestjs/common';
import {InjectModel} from "@nestjs/sequelize";

import {EditGenreDto} from './dto/edit-genre.dto';
import {Genre} from "./genre.model";


@Injectable()       // чтобы класс стал провайдером
export class GenreService {

    constructor(
        @InjectModel(Genre)     // чтобы могли делать запись в бд
        private genreRepository: typeof Genre) {      // будет взаимодействовать с бд
    }


    async getAll() {
        // возвращаем genres
        return this.genreRepository.findAll({
            order: [['id', 'ASC']],        // отсортировать по id
            attributes: {exclude: ['updatedAt']}    // исключить поле
        });
    }


    // редактировать жанры в бд
    async edit(genreId: number, genreDto: EditGenreDto) {
        try {
            const genre = await this.genreRepository.update(genreDto, {
                where: {id: genreId},
                returning: ['id', 'name', 'name_en'],          // вернуть поля
            })
            if (genre[0] === 0) {      // если ни одно поле не обновилось
                // передает в catch ошибку 404
                throw new NotFoundException();
            }
            return genre[1][0];
        } catch (e) {
            if ('status' in e && e.status == 404) {
                throw new HttpException(
                    'Жанр не найден ' +
                    'или поля для обновления не переданы',
                    HttpStatus.NOT_FOUND
                )
            }
            // если передаваемое значение поля не уникально
            if (e.name == 'SequelizeUniqueConstraintError') {
                throw new HttpException(
                    `${e.original.detail}`,
                    HttpStatus.BAD_REQUEST
                )
            }
        }

    }
}
