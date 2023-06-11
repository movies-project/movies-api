import {BelongsToMany, Column, DataType, Model, Table} from "sequelize-typescript";
import {ApiProperty} from "@nestjs/swagger";
import {Movie} from "../movie/models/movie.model";


interface GenreCreationAttrs {   // поля, которые нужны для создания класса Genre
    name: string;
}

@Table({        // чтобы класс стал таблицей в бд, таблица genre
    tableName: 'genre',
    createdAt: false       // не добавлять дату создания
})
export class Genre extends Model<Genre, GenreCreationAttrs> {

    @ApiProperty({      // документирование swagger, Response Schema
        example: '1',
        description: 'Уникальный идентификатор'
    })
    @Column({
        type: DataType.INTEGER,
        unique: true,
        autoIncrement: true,
        primaryKey: true
    })
    id: number;     // поле


    @ApiProperty({      // документирование swagger, Response Schema
        example: 'фантастика',
        description: 'Уникальное название жанра'
    })
    @Column({
        type: DataType.STRING,
        unique: true,
        allowNull: false    // не может быть пустым
    })
    name: string;     // поле


    @ApiProperty({      // документирование swagger, Response Schema
        example: 'fantastic',
        description: 'Уникальное название жанра на английском языке',
        nullable: true      // может быть пустым
    })
    @Column({
        type: DataType.STRING,
        unique: true,
        allowNull: true    // может быть пустым
    })
    name_en: string;     // поле


    // многие-ко-многим
    // связываем Genre с Movie через таблицу film_genre
    @BelongsToMany(
      () => Movie,
      {
          through: 'film_genre',
          foreignKey: 'genre_id',
          otherKey: 'film_id',
          onDelete: 'CASCADE',
          onUpdate: 'CASCADE'
      })
    movies: Movie[];           // поле: тип

}
