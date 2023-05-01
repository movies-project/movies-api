import { SequelizeModuleOptions } from "@nestjs/sequelize/dist/interfaces/sequelize-options.interface";

export const postgresConfig = {
  SEQUELIZE_OPTIONS: <SequelizeModuleOptions>{
    dialect: 'postgres',
    host: process.env.POSTGRES_HOST || 'postgres',
    port: process.env.POSTGRES_PORT || 5432,
    username: process.env.POSTGRES_USER || 'root',
    password: process.env.POSTGRES_PASSWORD || 'root',
    database: process.env.POSTGRES_DB || 'postgres',
    autoLoadModels: true,
    synchronize: true
  },
}