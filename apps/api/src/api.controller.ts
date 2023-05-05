import { Controller, Get, Param } from "@nestjs/common";
import { ApiService } from "./api.service";

@Controller('api')
export class ApiController {
  constructor(private readonly apiService: ApiService) {}

  @Get('service-docs/:name')
  async getServiceDoc(@Param('name') name: string) {
    return await this.apiService.getServiceDoc(name);
  }
}
