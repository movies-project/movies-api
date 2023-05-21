import { ApiProperty } from "@nestjs/swagger";

export class Premiere {
  @ApiProperty({
    description: 'Страна',
    example: 'США'
  })
  country: string;

  @ApiProperty({
    example: new Date("1970-01-01T00:00:00.000Z")
  })
  world: Date;

  @ApiProperty({
    example: new Date("1970-01-01T00:00:00.000Z")
  })
  russia: Date;

  @ApiProperty({
    example: new Date("1970-01-01T00:00:00.000Z")
  })
  cinema: Date;

  @ApiProperty({
    example: new Date("1970-01-01T00:00:00.000Z")
  })
  dvd: Date;

  @ApiProperty({
    example: new Date("1970-01-01T00:00:00.000Z")
  })
  bluray: Date;
}