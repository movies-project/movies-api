import { SequelizeModuleOptions } from "@nestjs/sequelize/dist/interfaces/sequelize-options.interface";

export const postgresConfig = {
  SEQUELIZE_OPTIONS: <SequelizeModuleOptions>{
    dialect: 'postgres',
    host: process.env.POSTGRES_HOST,
    port: Number(process.env.POSTGRES_PORT),
    username: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    database: process.env.POSTGRES_DB,
    autoLoadModels: true,
    synchronize: true
  },
}
