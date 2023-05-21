export type DocsConfig = {
  url: string,
  name: string,
  description?: string,
  endpoint: string
}

const docs = {
  AUTH_API: <DocsConfig>{
    url: 'http://auth:3001/api-docs',
    name: 'Auth API',
    description: `Authorization and user data API`,
    endpoint: 'auth'
  },
  PROFILE_API: <DocsConfig>{
    url: 'http://profile:3002/api-docs',
    name: 'Profile API',
    description: `Profile user data`,
    endpoint: 'profile'
  },
  MOVIE_API: <DocsConfig>{
    url: 'http://movie:3003/api-docs',
    name: 'Movie API',
    description: `Movie management API`,
    endpoint: 'movie'
  }
}

export const swaggerConfig = {
  docs
}