import { ForbiddenException } from "@nestjs/common";

export class RolePermissionException extends ForbiddenException {
  constructor() {
    super('Отказано в доступе');
  }
}