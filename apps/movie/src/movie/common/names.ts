import { ApiProperty } from "@nestjs/swagger";

export class Name {
  @ApiProperty({
    description: 'Название',
    example: 'Неприкасаемые'
  })
  name: string;

  @ApiProperty({
    description: 'Язык',
    example: 'RU'
  })
  language: string;

  @ApiProperty({
    description: 'Тип',
    example: 'Literal'
  })
  type: string;
}

export type Names = Array<Name>;