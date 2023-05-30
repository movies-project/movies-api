import {Module} from '@nestjs/common';
import {SequelizeModule} from "@nestjs/sequelize";
import {ClientsModule} from "@nestjs/microservices";

import {GenreController} from './genre.controller';
import {GenreService} from './genre.service';
import {Genre} from "./genre.model";
import {rabbitmqConfig} from "@app/config";


@Module({
    controllers: [GenreController],
    providers: [GenreService],      // чтобы в контроллере использовать логику
    imports: [
        SequelizeModule.forFeature([Genre]),    // чтобы использовать модели в GenreService
        ClientsModule.register([rabbitmqConfig.RMQ_AUTH_MODULE_OPTIONS]),   // чтобы отправлять в очередь auth в JwtAuthGuard
    ]

})
export class GenreModule {
}
