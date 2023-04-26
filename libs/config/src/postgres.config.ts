import { SequelizeModuleOptions } from "@nestjs/sequelize/dist/interfaces/sequelize-options.interface";

export const postgresConfig = {
  SEQUELIZE_OPTIONS: <SequelizeModuleOptions>{
    dialect: 'postgres',
    host: process.env.POSTGRES_HOST || 'localhost',
    port: process.env.POSTGRES_PORT || 5432,
    username: process.env.POSTGRES_USER || 'postgres',
    password: process.env.POSTGRES_PASSWORD || 'postgres',
  },
}