import {Injectable} from '@nestjs/common';
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
    async update(genreId: number, genreDto: EditGenreDto): Promise<Genre> | undefined {
        const [, [updatedGenre]] = await this.genreRepository.update(genreDto, {
            where: {id: genreId},
            returning: true,          // вернуть все поля
        })
        if (updatedGenre) {
            // удаляем поле updatedAt
            delete updatedGenre['dataValues']['updatedAt']
        }

        return updatedGenre;
    }
}
