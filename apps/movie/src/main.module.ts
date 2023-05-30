import {Module} from '@nestjs/common';
import {SequelizeModule} from "@nestjs/sequelize";

import {GenreModule} from './genre/genre.module';
import {postgresConfig} from "@app/config";

@Module({
    imports: [
        SequelizeModule.forRoot(postgresConfig.MOVIE_DB_OPTIONS),

        GenreModule,
    ],
    controllers: [],
    providers: [],
})
export class MainModule {
}
