import { RmqOptions, Transport } from '@nestjs/microservices';
import { ClientsModuleOptions } from "@nestjs/microservices/module/interfaces";
import { SharedModule } from "@app/shared";

const HOST = process.env.RABBITMQ_HOST || 'localhost';
const PORT = process.env.RABBITMQ_PORT || 5672;
const USER = process.env.RABBITMQ_USER || 'guest';
const PASSWORD = process.env.RABBITMQ_PASSWORD || 'guest';
const URL = `amqp://${USER}:${PASSWORD}@${HOST}:${PORT}`;

const RMQ_OPTIONS = <RmqOptions>{
  transport: Transport.RMQ,
  options: {
    urls: [URL],
    queueOptions: {
      durable: true,
    }
  }
}

const RMQ_AUTH_OPTIONS = <ClientsModuleOptions>[{
  name: 'AUTH_SERVICE',
  ...SharedModule.assignQueueToRmqOptions(RMQ_OPTIONS, 'auth')
}]

export const rabbitmqConfig = {
  RMQ_OPTIONS,
  RMQ_AUTH_OPTIONS
}