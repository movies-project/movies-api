import { ApiProperty } from "@nestjs/swagger";

export class Distributors {
  @ApiProperty({
    description: 'Распространитель'
  })
  distributor: string;

  @ApiProperty({
    description: 'Публикация'
  })
  distributorRelease: string;
}