import {ApiProperty} from "@nestjs/swagger";

export class NotFoundErrorGenreResponseDto {

    @ApiProperty({      // документирование swagger, Response Schema
        example: 404,
    })
    readonly statusCode: number;


    @ApiProperty({      // документирование swagger, Response Schema
        example: 'Жанр не найден или поля для обновления не переданы',
    })
    readonly message: string;

}
