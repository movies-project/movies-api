import { Module } from "@nestjs/common";
import { SharedService } from './shared.service';
import { RmqOptions } from "@nestjs/microservices";

@Module({
  imports: [],
  providers: [SharedService],
  exports: [SharedService],
})
export class SharedModule {
  static assignQueueToRmqOptions(rmqOptions: RmqOptions, queue: string): RmqOptions {
    rmqOptions.options.queue = queue;
    return rmqOptions;
  }
}