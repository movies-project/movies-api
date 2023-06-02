import {Injectable} from '@nestjs/common';
import {InjectModel} from "@nestjs/sequelize";

import {Country} from "./country.model";


@Injectable()       // чтобы класс стал провайдером
export class CountryService {

    constructor(
        @InjectModel(Country)
        private countryRepository: typeof Country) {      // будет взаимодействовать с бд
    }

    async getAll() {
        // возвращаем countries
        return this.countryRepository.findAll({
            order: [['id', 'ASC']],        // отсортировать по id
            attributes: {exclude: ['updatedAt']}    // исключить поле
        });
    }
}
