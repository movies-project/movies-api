export type DocsConfig = {
    url: string,
    name: string,
    description?: string,
    endpoint: string
}

const SWAGGER_MODULE_DESCRIPTION = 'Документация API является многостраничной.\n\n' +
    'Выбрать необходимый раздел можно в выпадающем списке в «Select a definition».'

const docs = {
    AUTH_API: <DocsConfig>{
        url: 'http://auth:3001/api-docs',
        name: 'Auth API',
        description: '### Раздел API для авторизации и получения данных пользователя\n' +
            SWAGGER_MODULE_DESCRIPTION,
        endpoint: 'auth'
    },
    PROFILE_API: <DocsConfig>{
        url: 'http://profile:3002/api-docs',
        name: 'Profile API',
        description: '### Раздел API для работы с данными профиля пользователя\n' +
            SWAGGER_MODULE_DESCRIPTION,
        endpoint: 'profile'
    },
    MOVIE_API: <DocsConfig>{
        url: 'http://movie:3003/api-docs',
        name: 'Movie API',
        description: '### Раздел API для работы с фильмами\n' +
            SWAGGER_MODULE_DESCRIPTION,
        endpoint: 'movie'
    }
}

export const swaggerConfig = {
    docs
}
