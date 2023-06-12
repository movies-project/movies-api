import { NotFoundException } from "@nestjs/common";

export class TrailerNotFoundException extends NotFoundException {
  constructor() {
    super('Трейлер не найден');
  }
}