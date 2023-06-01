import { INestApplication, Module } from "@nestjs/common";
import { SharedService } from './shared.service';
import { RmqOptions } from "@nestjs/microservices";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { DocsConfig } from "@app/config/swagger.config";
import * as url from "url";
import * as _ from "lodash";

@Module({
  imports: [],
  providers: [SharedService],
  exports: [SharedService],
})
export class SharedModule {
  static assignQueueToRmqOptions(rmqOptions: RmqOptions, queue: string): RmqOptions {
    const newRmqOptions = _.cloneDeep<RmqOptions>(rmqOptions);
    newRmqOptions.options.queue = queue;
    return newRmqOptions;
  }

  static setupSwaggerFromConfig(app: INestApplication, config: DocsConfig) {
    const swaggerOptions = new DocumentBuilder()
      .setTitle(config.name)
      .setDescription(config.description)
      .addBearerAuth()
      .build();

    const document = SwaggerModule.createDocument(app, swaggerOptions);
    const pathname = url.parse(config.url).pathname;
    SwaggerModule.setup(pathname, app, document);
  }
}