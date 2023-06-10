import { ApiProperty } from "@nestjs/swagger";
import { IsNumberString, IsOptional, IsString } from "class-validator";

export class FilterMovieDto {

  @ApiProperty({
    required: false,
    type: [Number],
    description: 'Идентификатор жанра'
  })
  @IsOptional()
  @IsString({ each: true })
  genreId?: string[];


  @ApiProperty({
    required: false,
    type: [Number],
    description: 'Идентификатор страны'
  })
  @IsOptional()
  @IsString({ each: true })
  countryId?: string[];


  @ApiProperty({
    required: false,
    type: Number,
    example: 7.3,
    description: 'Рейтинг, начиная от которого искать'
  })
  @IsOptional()
  @IsNumberString()
  minRating?: string;


  @ApiProperty({
    required: false,
    type: Number,
    description: 'Количество оценок, начиная от которого искать'
  })
  @IsOptional()
  @IsNumberString()
  minVotes?: string;


  @ApiProperty({
    required: false,
    type: String,
    description: 'Строка для поиска названия фильма'
  })
  @IsOptional()
  @IsString()
  searchString?: string;


  @ApiProperty({
    required: false,
    type: String,
    enum: ['votes', 'rating', 'year', 'name'],
    description: 'Поле, по которому отсортировать\n\n' +
      'Доступные поля:\n' +
      '* votes - сортирует по votes.kp по убыванию\n' +
      '* rating - сортирует по rating.kp по убыванию\n' +
      '* year - по убыванию\n' +
      '* name - по алфавиту\n'
  })
  @IsOptional()
  @IsString()
  sortField?: string;
}
