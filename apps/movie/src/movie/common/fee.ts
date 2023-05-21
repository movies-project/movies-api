import { ApiProperty } from "@nestjs/swagger";

export class Fee {
  @ApiProperty({
    description: 'Значение',
    example: '1000'
  })
  value: number;

  @ApiProperty({
    description: 'Валюта',
    example: '$'
  })
  currency: string;
}

export interface Fees {
  [key: string]: Fee;
}