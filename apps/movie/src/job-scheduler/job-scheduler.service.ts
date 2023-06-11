import { Injectable, OnModuleInit } from "@nestjs/common";
import { InjectQueue } from "@nestjs/bull";
import { Queue } from "bull";
import { bullConfig } from "@app/config/bull.config";
import { movieProcesses } from "@app/microservices/movie/movie-processes";
import { movieConfig } from "../movie/config/movie.config";

@Injectable()
export class JobSchedulerService implements OnModuleInit {
    constructor(
      @InjectQueue(bullConfig.BULL_MOVIE_QUEUE)
      private readonly movieQueue: Queue
    ) {}

    async onModuleInit() {
        await this.scheduleCacheBestMovies();
    }

    async scheduleCacheBestMovies() {
        // Конвертируем секунды в миллисекунды
        const cacheInterval = movieConfig.REDIS_KEY_RENEWAL_BEST_MOVIES * 1000;

        // Добавляем задачу в очередь
        await this.movieQueue.add(
          movieProcesses.CACHE_BEST_MOVIES,
        { repeat: { every: cacheInterval } }
        );
    }
}
