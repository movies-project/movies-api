import { Module } from '@nestjs/common';
import { BullModule } from "@nestjs/bull";
import { bullConfig } from "@app/config/bull.config";
import { redisConfig } from "@app/config/redis.config";
import { JobSchedulerService } from "./job-scheduler.service";

@Module({
    imports: [
        BullModule.forRoot({
            redis: <any>redisConfig.REDIS_BULL_OPTIONS.config
        }),
        BullModule.registerQueue(bullConfig.BULL_MOVIE_OPTIONS)
    ],
    controllers: [],
    providers: [JobSchedulerService],
})
export class JobSchedulerModule {
}
