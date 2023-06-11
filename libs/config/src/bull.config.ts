import { BullModuleOptions } from "@nestjs/bull/dist/interfaces/bull-module-options.interface";

const BULL_MOVIE_QUEUE = 'movie-queue';
const BULL_MOVIE_OPTIONS = <BullModuleOptions>{
  name: 'movie-queue'
}

export const bullConfig = {
  BULL_MOVIE_QUEUE,
  BULL_MOVIE_OPTIONS
}