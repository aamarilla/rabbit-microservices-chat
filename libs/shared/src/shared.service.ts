import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { RmqOptions, Transport } from '@nestjs/microservices';

@Injectable()
export class SharedService {
    constructor(private readonly configService: ConfigService) 
    {}

    getRmqOptions(queue: string): RmqOptions{
        const USER = this.configService.get<string>('RABBITMQ_USER');
        const PASSWORD = this.configService.get<string>('RABBITMQ_PASSWORD');
        const HOST = this.configService.get<string>('RABBITMQ_HOST');

        return {
            transport: Transport.RMQ,
            options: {
              urls: [`amqp://${USER}:${PASSWORD}@${HOST}`],
              noAck: false,
              queue,
              queueOptions: {
                durable: true,
              },
            }
        }
    }

    acknowledgeMessage(context: any) {
        const channel = context.getChannelRef();
        const message = context.getMessage();
        channel.ack(message);
    }
}
