import {Injectable, NotFoundException} from "@nestjs/common";
import {HttpService} from "@nestjs/axios";
import {map} from "rxjs";
import {swaggerConfig} from "@app/config/swagger.config";

@Injectable()
export class ApiService {
    constructor(private readonly httpService: HttpService) {
    }

    async getServiceDoc(apiName: string) {
        const docInfo = Object
            .values(swaggerConfig.docs)
            .find(element => element.endpoint == apiName);
        if (!docInfo)
            throw new NotFoundException('documentation not found');

        return this.httpService.get(`${docInfo.url}-json`).pipe(
            // Ответ (resp) - это объект, содержащий различные поля (например, data, status, headers).
            // Нам нужны только данные из ответа, поэтому мы используем map((resp) => resp.data).
            map((resp) => resp.data)
        );
    }
}
