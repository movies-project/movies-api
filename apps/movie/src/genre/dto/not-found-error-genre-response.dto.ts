import {ApiProperty} from "@nestjs/swagger";

export class NotFoundErrorGenreResponseDto {

    @ApiProperty({      // документирование swagger, Response Schema
        example: 404,
    })
    readonly statusCode: number;


    @ApiProperty({      // документирование swagger, Response Schema
        example: 'Жанр с указанным id не найден',
    })
    readonly message: string;


    @ApiProperty({      // документирование swagger, Response Schema
        example: 'Not Found',
    })
    readonly error: string;

}
