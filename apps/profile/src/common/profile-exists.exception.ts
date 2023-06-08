import { ConflictException } from "@nestjs/common";

export class ProfileExistsException extends ConflictException {
  constructor() {
    super('Профиль с указанными данными уже существует');
  }
}