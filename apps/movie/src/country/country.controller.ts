import {Controller, Get} from '@nestjs/common';
import {ApiOkResponse, ApiOperation, ApiTags} from "@nestjs/swagger";

import {CountryService} from "./country.service";
import {Country} from "./country.model";

// endpoints /countries/

@ApiTags('Страны')    // документирование swagger
@Controller('countries')    // сделать класс контроллером, обрабатывать запросы на /countries/
export class CountryController {

    constructor(private countryService: CountryService) {    // инъекция CountryService, чтобы использовать сервис внутри контроллера
    }

    @Get()
    @ApiOperation({summary: 'Получить все страны'})    // документирование swagger
    @ApiOkResponse({            // 200
        type: [Country]
    })
    async getAll(): Promise<Country[]> {
        return this.countryService.getAll();        // возвращает результат из сервиса
    }

}
