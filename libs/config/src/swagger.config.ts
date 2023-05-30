export type DocsConfig = {
    url: string,
    name: string,
    description?: string,
    endpoint: string
}

const docs = {
    PROFILE_API: <DocsConfig>{
        url: 'http://profile:3002/api-docs',
        name: 'Profile API',
        description: `### Раздел API для работы с данными профиля пользователя
        Текущая документация является многостраничной  
        Выбрать необходимый раздел можно в выпадающем списке в Select a definition`,
        endpoint: 'profile'
    },
    AUTH_API: <DocsConfig>{
        url: 'http://auth:3001/api-docs',
        name: 'Auth API',
        description: `### Раздел API для авторизации и получения данных пользователя
        Текущая документация является многостраничной  
        Выбрать необходимый раздел можно в выпадающем списке в Select a definition`,
        endpoint: 'auth'
    },
    MOVIE_API: <DocsConfig>{
        url: 'http://movie:3003/api-docs',
        name: 'Movie API',
        description: `### Раздел API для работы с фильмами
        Текущая документация является многостраничной  
        Выбрать необходимый раздел можно в выпадающем списке в Select a definition`,
        endpoint: 'movie'
    }
}

export const swaggerConfig = {
    docs
}
