import { applyDecorators, HttpException, INestApplication, Module } from "@nestjs/common";
import { SharedService } from './shared.service';
import { RmqOptions } from "@nestjs/microservices";
import { ApiProperty, DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
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

  static generateDocsByObject(name: string, instance: any): any {
    // Получение названий свойств объекта
    const keys = Object.keys(instance);

    // Создание класса с декорированными свойствами
    const GeneratedClass = class { };
    Object.defineProperty(GeneratedClass, 'name', { value: name });

    // Декорирование свойств класса
    for (let key of keys) {
      GeneratedClass.prototype[key] = instance[key];

      applyDecorators(ApiProperty({
        type: typeof instance[key],
        example: instance[key],
      }))(GeneratedClass.prototype, key);
    }

    return GeneratedClass;
  }

  static generateDocsByHttpException(exception: HttpException, name: string = '') {
    if (!name)
      name = exception.name.replace('Exception', 'ErrorResponse');
    return SharedModule.generateDocsByObject(
      name,
      exception.getResponse()
    );
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