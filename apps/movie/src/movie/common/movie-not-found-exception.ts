import { NotFoundException } from "@nestjs/common";

export class MovieNotFoundException extends NotFoundException {
  constructor() {
    super('Фильм не найден');
  }
}