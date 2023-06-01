import { Module } from '@nestjs/common';
import { SequelizeModule } from "@nestjs/sequelize";
import { RedisModule } from "@liaoliaots/nestjs-redis";
import { postgresConfig } from "@app/config/postgres.config";
import { redisConfig } from "@app/config/redis.config";

import { UserModule } from './user/user.module';
import { SessionModule } from './session/session.module';

@Module({
  imports: [
    SequelizeModule.forRoot(postgresConfig.AUTH_DB_OPTIONS),
    RedisModule.forRoot(redisConfig.REDIS_AUTH_OPTIONS),
    UserModule,
    SessionModule
  ],
  controllers: [],
  providers: [],
})
export class AuthModule {}
