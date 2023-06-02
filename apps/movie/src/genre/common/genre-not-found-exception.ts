import { NotFoundException } from "@nestjs/common";

export class GenreNotFoundException extends NotFoundException {
  constructor() {
    super('Жанр с указанным id не найден');
  }
}