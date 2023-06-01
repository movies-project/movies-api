import { ArgumentMetadata, BadRequestException, Injectable, PipeTransform } from "@nestjs/common";

@Injectable()
export class LimitValidationPipe implements PipeTransform {
  constructor(private readonly maxLimit: number) {}

  transform(value: any, metadata: ArgumentMetadata) {
    if (metadata.type != 'query')
      return value;

    if (!value.offset)
      value.offset = 0;

    if (!value.limit)
      value.limit = this.maxLimit;

    if (value.limit > this.maxLimit)
      throw new BadRequestException(`Превышен лимит возвращаемых значений. `
        + `Максимальноне возможное количество возвращаемых значений - ${this.maxLimit}`);

    return value;
  }
}