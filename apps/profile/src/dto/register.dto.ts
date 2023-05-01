import { IsEmail, IsMobilePhone, IsOptional, MaxLength, MinLength } from "class-validator";

export class ProfileRegistrationData {
  @IsEmail()
  email: string;

  @MinLength(8)
  @MaxLength(256)
  password: string;

  @MinLength(1)
  @MaxLength(256)
  name: string;

  @MinLength(1)
  @MaxLength(256)
  surname: string;

  @IsOptional()
  @IsMobilePhone()
  phoneNumber: string;

  @IsOptional()
  selfDescription: string;
}