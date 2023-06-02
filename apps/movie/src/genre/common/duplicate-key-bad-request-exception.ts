import { BadRequestException } from "@nestjs/common";

export class DuplicateKeyBadRequestException extends BadRequestException {
  constructor(key: string, value: string) {
    super(`Ключ (${key})=(${value}) уже существует`);
  }
}