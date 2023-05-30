import {ApiProperty} from "@nestjs/swagger";

export class ForbiddenErrorResponseDto {

    @ApiProperty({      // документирование swagger, Response Schema
        example: 403,
    })
    readonly statusCode: number;


    @ApiProperty({      // документирование swagger, Response Schema
        example: 'Forbidden resource',
    })
    readonly message: string;


    @ApiProperty({      // документирование swagger, Response Schema
        example: 'Forbidden',
    })
    readonly error: string;

}
