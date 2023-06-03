import {ArgumentMetadata, BadRequestException, Injectable, PipeTransform} from "@nestjs/common";

@Injectable()
export class LimitValidationPipe implements PipeTransform {
    constructor(private readonly minLimit: number,
                private readonly maxLimit: number) {
    }

    transform(fieldValue: any, metadata: ArgumentMetadata) {     // fieldValue - значение передаваемого поля

        if (metadata.type != 'query') {
            return fieldValue;
        }

        if (metadata.data == 'offset') {
            fieldValue = Number(fieldValue);
            if (!fieldValue) {
                fieldValue = 0;
            }
        }

        if (metadata.data == 'limit') {
            fieldValue = Number(fieldValue);
            if (!fieldValue) {
                fieldValue = this.minLimit;
            }
        }

        if (metadata.data == 'limit' && fieldValue > this.maxLimit)
            throw new BadRequestException(`Превышен лимит возвращаемых значений. `
                + `Максимально возможное количество возвращаемых значений - ${this.maxLimit}`);

        return fieldValue;
    }
}
