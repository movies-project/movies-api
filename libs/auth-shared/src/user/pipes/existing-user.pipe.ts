import { Injectable, PipeTransform } from "@nestjs/common";
import { UserSharedService } from "@app/auth-shared/user/user-shared.service";

export function ExistingUserPipe(shouldExist: boolean, error: Error) {
  @Injectable()
  class ExistingUserPipeMixin implements PipeTransform {
    constructor(
      public readonly userSharedService: UserSharedService
    ) {}

    async transform(value: any): Promise<any> {
      const user = await this.userSharedService.findByEmail(value.email);

      if (Boolean(user) !== shouldExist)
        throw error;

      return value;
    }
  }

  return ExistingUserPipeMixin;
}
