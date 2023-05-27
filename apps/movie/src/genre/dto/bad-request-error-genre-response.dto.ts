import {ApiProperty} from "@nestjs/swagger";

export class BadRequestErrorGenreResponseDto{

    @ApiProperty({      // документирование swagger, Response Schema
        example: 400,
    })
    readonly statusCode: number;


    @ApiProperty({      // документирование swagger, Response Schema
        example: 'Key (name)=(фантастика) already exists.',
    })
    readonly message: string;

}
