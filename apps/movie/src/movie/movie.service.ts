import {Injectable} from "@nestjs/common";
import {InjectModel} from "@nestjs/sequelize";
import {Repository} from "sequelize-typescript";
import {literal, Op} from "sequelize";
import {OrderItem} from "sequelize/types/model";
import {InjectRedis} from "@liaoliaots/nestjs-redis";
import Redis from "ioredis";

import {Movie} from "./models/movie.model";
import {Genre} from "../genre/genre.model";
import {Country} from "../country/country.model";
import {CreateMovieDto} from "./dto/create-movie.dto";
import {UpdateMovieDto} from "./dto/update-movie.dto";
import {redisConfig} from "@app/config/redis.config";
import {movieConfig} from "./config/movie.config";


@Injectable()
export class MovieService {

    constructor(
        @InjectModel(Movie)
        private readonly movieRepository: Repository<Movie>,
        @InjectRedis(redisConfig.MOVIE_REDIS_NAMESPACE)
        private readonly redis: Redis
    ) {
    }

    // Версия данных для ключей Redis
    private redisTimestamp: number = Date.now();

    private static getBestMoviesRedisKey(timestamp: number) {
        return `bestMovies:${timestamp}`;
    }

    async findOne(id: number): Promise<Movie> {
        return await this.movieRepository.findByPk(
            id,
            {
                attributes: {exclude: ['updatedAt', 'createdAt', 'idkp']},    // исключить поля
                include: [
                    {
                        all: true,                      // добавить все поля всех моделей, которые связаны
                        attributes: {exclude: ['updatedAt', 'createdAt']},    // исключить поля
                        through: {
                            attributes: [],      // исключаем поля с промежуточными таблицами
                        },
                    },
                    {
                        // отдельная настройка для similarMovies
                        model: Movie,
                        duplicating: true,      // true - использовать подзапрос, не преобразовать в простой join, для корректной работы limit
                        attributes: ['id', 'name', 'nameEn', 'alternativeName', 'type'],
                        through: {
                            attributes: [],      // исключаем поле film_similar_film из результатов запроса
                        },
                    }
                ],
            });
    }

    async findRandom(limit?: number): Promise<Movie[]> {
        return await this.movieRepository.findAll({
            order: this.movieRepository.sequelize.random(),
            limit: limit
        });
    }


    async getMovies(genreIds: string[], countryIds: string[], minRating: string,
                    minVotes: string, searchString: string, sortField: string,
                    limit: number, offset: number): Promise<Movie[]> {
        if (genreIds && (typeof genreIds == 'string')) {
            genreIds = [genreIds]   // преобразуем одно значение в массив
        }

        if (countryIds && (typeof countryIds == 'string')) {
            countryIds = [countryIds]   // преобразуем одно значение в массив
        }

        let filterMinRating = {}
        if (minRating) {
            minRating = minRating.replace(',', '.')
            filterMinRating = {
                rating: {
                    kp: {
                        [Op.gte]: Number(minRating)     // >=
                    }
                }
            }
        }

        let filterMinVotes = {}
        if (minVotes) {
            filterMinVotes = {
                votes: {
                    kp: {
                        [Op.gte]: Number(minVotes)      // >=
                    }
                }
            }
        }

        let filterSearchString = {}
        if (searchString) {
            filterSearchString = {
                name: {
                    [Op.startsWith]: searchString
                }
            }
        }

        let filterGenreIds = {}
        if (genreIds) {
            filterGenreIds = {
                id: {
                    [Op.in]: genreIds      // выводит только указанные жанры из всех в фильме
                }
            }
        }

        let filterCountryIds = {}
        if (countryIds) {
            filterCountryIds = {
                id: {
                    [Op.in]: countryIds      // выводит только указанные страны из всех в фильме
                }
            }
        }

        let sortBySortField: OrderItem = ['id', 'ASC']
        if (sortField) {
            switch (sortField) {
                case 'votes':
                    sortBySortField = ['votes.kp', 'DESC']
                    break;
                case 'rating':
                    sortBySortField = ['rating.kp', 'DESC']
                    break;
                case 'year':
                    sortBySortField = ['year', 'DESC']
                    break;
                case 'name':
                    sortBySortField = ['name', 'ASC']
            }
        }


        const filteredMovies = await this.movieRepository.findAll({
            where: {
                [Op.and]: [
                    filterMinRating,
                    filterMinVotes,
                    filterSearchString
                ],
            },
            include: [
                {
                    model: Genre,
                    where: filterGenreIds,
                    duplicating: true,      // true - использовать подзапрос, не преобразовать в простой join, для корректной работы limit
                    through: {
                        attributes: [],      // исключаем поле film_genre из результатов запроса
                    },
                },
                {
                    model: Country,
                    where: filterCountryIds,
                    duplicating: true,      // true - использовать подзапрос, не преобразовать в простой join, для корректной работы limit
                    through: {
                        attributes: [],      // исключаем поле film_country из результатов запроса
                    },
                }
            ],
            order: [sortBySortField],
            limit: limit,
            offset: offset
        });

        // получаем id из результатов
        const movieIds = filteredMovies.map(movie => movie.id)

        // возвращаем все фильмы с этими id, включая все их жанры и страны
        return this.movieRepository.findAll({
            where: {
                id: {
                    [Op.in]: movieIds
                },
            },
            include: [
                {
                    all: true,                      // добавить все поля всех моделей, которые связаны
                    attributes: {exclude: ['updatedAt', 'createdAt']},    // исключить поля
                    through: {
                        attributes: [],      // исключаем поля с промежуточными таблицами
                    },
                    duplicating: false,      // false - не использовать подзапрос, преобразовать в простой join
                },
                {
                    // отдельная настройка для similarMovies
                    model: Movie,
                    duplicating: true,      // true - использовать подзапрос, не преобразовать в простой join, для корректной работы limit
                    attributes: ['id', 'name', 'nameEn', 'alternativeName', 'type'],
                    through: {
                        attributes: [],      // исключаем поле film_similar_film из результатов запроса
                    },
                }],
            attributes: {exclude: ['updatedAt', 'createdAt', 'idkp']},    // исключить поля
        })

    }


    async getBestMovies(limit: number, offset: number): Promise<Movie[]> {
        const bestMoviesRedisKey = MovieService.getBestMoviesRedisKey(this.redisTimestamp);
        if (await this.redis.exists(bestMoviesRedisKey)) {
            // Получение закэшированных данных из Redis
            const cachedMovies = await this.redis.zrange(bestMoviesRedisKey, offset, offset + limit - 1);

            return cachedMovies.map(movie => JSON.parse(movie));
        }

        // Получение данных из БД
        const currentYear = new Date().getFullYear();
        const movies = await this.movieRepository.findAll({
            where: {
                year: {
                    [Op.gte]: currentYear - 10
                }
            },
            order: [
                [
                    literal(`
            COALESCE(rating->>'kp', '0')::numeric +
            COALESCE(rating->>'imdb', '0')::numeric +
            COALESCE(rating->>'tmdb', '0')::numeric +
            COALESCE(rating->>'filmCritics', '0')::numeric +
            COALESCE(rating->>'russianFilmCritics', '0')::numeric +
            COALESCE(rating->>'await', '0')::numeric
          `),
                    'DESC',
                ],
            ],
            limit: movieConfig.REDIS_MAX_CACHED_BEST_MOVIES
        });

        // Сохраяем полученные фильмы в базу данных Redis
        for (const [index, movie] of movies.entries()) {
            await this.redis.zadd(bestMoviesRedisKey, index, JSON.stringify(movie));
        }

        // Делаем ключ валидным только в течении 24 часов
        await this.redis.expire(bestMoviesRedisKey, 60 * 60 * 24);

        return movies.slice(offset, offset + limit);
    }

    async create(data: CreateMovieDto): Promise<Movie> {
        return await this.movieRepository.create(data);
    }

    async update(id: number, data: UpdateMovieDto): Promise<Movie> {
        const [, [updatedMovie]] = await this.movieRepository.update(
            data,
            {where: {id}, returning: true}
        );
        return updatedMovie;
    }

    async delete(id: number): Promise<boolean> {
        return Boolean(
            await this.movieRepository.destroy({where: {id}})
        );
    }
}
