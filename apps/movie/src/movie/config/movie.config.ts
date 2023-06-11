export const movieConfig = {
    MOVIE_LIST_LIMIT: {
        minLimit: 5,
        maxLimit: 50,
    },
    REDIS_MAX_CACHED_BEST_MOVIES: 1000,
    REDIS_KEY_EXPIRATION_BEST_MOVIES: 60 * 60 * 24, // в секундах (24 часа)
    REDIS_KEY_RENEWAL_BEST_MOVIES: 60 * 60 * 12, // в секундах (12 часов)
}
