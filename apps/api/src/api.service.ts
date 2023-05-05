import { Injectable, NotFoundException } from "@nestjs/common";
import { HttpService } from "@nestjs/axios";
import { map } from "rxjs";
import { swaggerConfig } from "@app/config/swagger.config";

@Injectable()
export class ApiService {
  constructor(private readonly httpService: HttpService) {}

  async getServiceDoc(apiName: string) {
    const url = Object
      .values(swaggerConfig.docs)
      .find(element => element.endpoint == apiName);
    if (!url)
      throw new NotFoundException('documentation not found');
    return this.httpService.get(`${url.url}-json`).pipe(map((resp) => resp.data));
  }
}
