import {Module} from '@nestjs/common';
import {SequelizeModule} from "@nestjs/sequelize";

import {GenreController} from './genre.controller';
import {GenreService} from './genre.service';
import {Genre} from "./genre.model";
import {AuthSharedModule} from "@app/auth-shared/auth-shared.module";
import {Movie} from "../movie/models/movie.model";


@Module({
    imports: [
        SequelizeModule.forFeature([Genre, Movie]), // чтобы использовать модели в GenreService
        AuthSharedModule
    ],
    controllers: [GenreController],
    providers: [GenreService], // чтобы в контроллере использовать логику
})
export class GenreModule {
}
