import { IsNotEmpty } from "class-validator";

export class LoginData {
  @IsNotEmpty()
  email: string;

  @IsNotEmpty()
  password: string;
}