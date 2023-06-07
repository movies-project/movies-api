import {BadRequestException} from "@nestjs/common";

export class DuplicateKeyBadRequestException extends BadRequestException {
    constructor(key: string, value: string) {
        // Заворачиваем в массив, т.к. ошибка 400 может возникать еще и
        // в случае, если поля не переданы, а там возвращается массив
        const message: Array<string> = [`Ключ (${key})=(${value}) уже существует`];
        super(message);
    }
}
