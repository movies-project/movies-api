import {ApiProperty} from "@nestjs/swagger";

export class BadRequestErrorGenreResponseDto {

    @ApiProperty({      // документирование swagger, Response Schema
        example: 400,
    })
    readonly statusCode: number;


    @ApiProperty({      // документирование swagger, Response Schema
        example: ['Ключ (name)=(фантастика) уже существует'],
    })
    readonly message: Array<string>;


    @ApiProperty({      // документирование swagger, Response Schema
        example: 'Bad Request',
    })
    readonly error: string;

}
