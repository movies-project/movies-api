## Описание
API для работы сайта кинофильмов  

Приложение подключается к базе данных со следующей структурой:  

![scheme_filmdb](https://user-images.githubusercontent.com/109981473/245131821-7111d2e8-0f3f-4088-ab59-b67401ce266f.png)

API состоит из трех разделов:  
* Auth API - раздел для авторизации и получения данных пользователя
* Profile API - раздел для работы с данными профиля пользователя
* Movie API - раздел для работы с фильмами

Проект основан на микросервисной архитектуре  

В проекте используются технологии:
* NestJS
* PostgreSQL
* ORM Sequelize
* RabbitMQ
* Redis
* KrakenD
* Docker
* Swagger

### Перед запуском
Создайте файл `.env` с переменными окружения по примеру из файла `example.env`

## Запуск через Docker

```bash
$ docker-compose build
```
```bash
$ docker-compose up
```
