import {ApiProperty} from "@nestjs/swagger";

export class EditGenreDto {     // какие поля нужны для редактирования Genre

    @ApiProperty({      // документирование swagger, что ожидаем на входе, Request Schema
        example: 'фантастика',
        description: 'Уникальное название жанра'
    })
    readonly name: string;


    @ApiProperty({      // документирование swagger, что ожидаем на входе, Request Schema
        example: 'fantastic',
        description: 'Уникальное название жанра на английском языке'
    })
    readonly name_en: string;
}
