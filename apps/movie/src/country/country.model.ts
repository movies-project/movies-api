import {BelongsToMany, Column, DataType, Model, Table} from "sequelize-typescript";
import {ApiProperty} from "@nestjs/swagger";
import {Movie} from "../movie/models/movie.model";


interface CountryCreationAttrs {    // поля, которые нужны для создания класса Country
    name: string;
}

@Table({        // чтобы класс стал таблицей в бд, таблица country
    tableName: 'country',
    createdAt: false       // не добавлять дату создания
})
export class Country extends Model<Country, CountryCreationAttrs> {

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
        example: 'Австралия',
        description: 'Уникальное название страны'
    })
    @Column({
        type: DataType.STRING,
        unique: true,
        allowNull: false    // не может быть пустым
    })
    name: string;     // поле


    @ApiProperty({      // документирование swagger, Response Schema
        example: 'Australia',
        description: 'Уникальное название страны на английском языке',
        nullable: true      // может быть пустым
    })
    @Column({
        type: DataType.STRING,
        unique: true,
        allowNull: true    // может быть пустым
    })
    name_en: string;     // поле


    // многие-ко-многим
    // связываем Country с Movie через таблицу film_country
    @BelongsToMany(
      () => Movie,
      {
          through: 'film_country',
          foreignKey: 'country_id',
          otherKey: 'film_id',
          onDelete: 'CASCADE',
          onUpdate: 'CASCADE'
      }
    )
    movies: Movie[];           // поле: тип

}
