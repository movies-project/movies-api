import { IsEmail, IsMobilePhone, IsOptional, MaxLength, MinLength } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class ProfileRegistrationData {
  @ApiProperty({
    example: 'example@gmail.com',
    description: 'Электронная почта пользователя',
    format: 'email'
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    example: 'pass12345',
    description: 'Пароль пользователя',
  })
  @MinLength(8)
  @MaxLength(256)
  password: string;

  @ApiProperty({
    example: 'Иван',
    description: 'Имя пользователя',
  })
  @MinLength(1)
  @MaxLength(256)
  name: string;

  @ApiProperty({
    example: 'Иванов',
    description: 'Фамилия пользователя',
  })
  @MinLength(1)
  @MaxLength(256)
  surname: string;

  @ApiProperty({
    example: '+79000000000',
    description: 'Номер телефона пользователя',
    required: false
  })
  @IsOptional()
  @IsMobilePhone()
  phoneNumber: string;

  @ApiProperty({
    example: 'Люблю смотреть фильмы',
    description: 'Описание пользователя',
    required: false
  })
  @IsOptional()
  selfDescription: string;
}