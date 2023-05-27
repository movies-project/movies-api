import { ClientProviderOptions } from "@nestjs/microservices/module/interfaces/clients-module.interface";
import { RmqOptions, Transport } from '@nestjs/microservices';
import { SharedModule } from "@app/shared";

const HOST = process.env.RABBITMQ_HOST || 'rabbitmq';
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

const RMQ_AUTH_OPTIONS = SharedModule.assignQueueToRmqOptions(RMQ_OPTIONS, 'auth');
const RMQ_AUTH_MODULE_OPTIONS = <ClientProviderOptions>{
  name: 'AUTH_SERVICE',
  ...RMQ_AUTH_OPTIONS
}

const RMQ_PROFILE_OPTIONS = SharedModule.assignQueueToRmqOptions(RMQ_OPTIONS, 'profile');
const RMQ_PROFILE_MODULE_OPTIONS = <ClientProviderOptions>{
  name: 'PROFILE_SERVICE',
  ...RMQ_PROFILE_OPTIONS
}

export const rabbitmqConfig = {
  RMQ_OPTIONS,
  RMQ_AUTH_OPTIONS,
  RMQ_AUTH_MODULE_OPTIONS,
  RMQ_PROFILE_OPTIONS,
  RMQ_PROFILE_MODULE_OPTIONS
}
