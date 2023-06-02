import {Module} from '@nestjs/common';
import {SequelizeModule} from "@nestjs/sequelize";

import {CountryController} from './country.controller';
import {CountryService} from './country.service';
import {Country} from "./country.model";


@Module({
    controllers: [CountryController],
    providers: [CountryService],      // чтобы в контроллере использовать логику
    imports: [
        SequelizeModule.forFeature([Country]),    // чтобы использовать модели в CountryService
    ]
})
export class CountryModule {
}
