import { RmqOptions, Transport } from '@nestjs/microservices';
import { ClientsModuleOptions } from "@nestjs/microservices/module/interfaces";
import { SharedModule } from "@app/shared";

const RABBITMQ_HOST = process.env.RABBITMQ_HOST || 'localhost';
const RABBITMQ_PORT = process.env.RABBITMQ_PORT || 5672;
const RABBITMQ_USER = process.env.RABBITMQ_USER || 'guest';
const RABBITMQ_PASSWORD = process.env.RABBITMQ_PASSWORD || 'guest';
const RABBITMQ_URL = `amqp://${RABBITMQ_USER}:${RABBITMQ_PASSWORD}@` +
  `${RABBITMQ_HOST}:${RABBITMQ_PORT}`;

const RMQ_OPTIONS = <RmqOptions>{
  transport: Transport.RMQ,
  options: {
    urls: [RABBITMQ_URL],
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