import { Controller, Logger, OnModuleInit } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';

import { KafkaConsumerFactoryService } from 'libs/kafka';

import { WorkerService } from './worker.service';

@Controller()
export class WorkerController implements OnModuleInit {
  readonly #logger = new Logger();

  constructor(
    private readonly service: WorkerService,
    private readonly kafkaConsumerFactoryService: KafkaConsumerFactoryService,
  ) {}

  public async onModuleInit(): Promise<void> {
    const consumer = this.kafkaConsumerFactoryService.get();
    consumer.subscribeToResponseOf('test');
    console.log('Consumer is connecting...');
    await consumer.connect();
    console.log('Consumer connected successfully');
  }

  @MessagePattern('test')
  public async consume(@Payload() event: any): Promise<void> {
    this.#logger.debug(JSON.stringify(event, null, 2));
    await this.service.consume(event);
  }
}
