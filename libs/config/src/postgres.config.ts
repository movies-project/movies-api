import {SequelizeModuleOptions} from "@nestjs/sequelize/dist/interfaces/sequelize-options.interface";

const POSTGRES_BASE_OPTIONS = <SequelizeModuleOptions>{
    dialect: 'postgres',
    host: process.env.POSTGRES_HOST,
    port: Number(process.env.POSTGRES_PORT),
    username: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    autoLoadModels: true,
    synchronize: true
}

export const postgresConfig = {
    AUTH_DB_OPTIONS: <SequelizeModuleOptions>{
        ...POSTGRES_BASE_OPTIONS,
        database: 'users',
    },
    PROFILE_DB_OPTIONS: <SequelizeModuleOptions>{
        ...POSTGRES_BASE_OPTIONS,
        database: 'profiles',
    },
    MOVIE_DB_OPTIONS: <SequelizeModuleOptions>{
        ...POSTGRES_BASE_OPTIONS,
        database: 'movies',
    },
}
