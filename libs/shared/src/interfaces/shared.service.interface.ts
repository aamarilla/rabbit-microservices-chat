import { RmqContext, RmqOptions } from "@nestjs/microservices";


export interface SharedServiceInterface {
    acknowledgeMessage(context: RmqContext): void;
    getRmqOptions(queue: string): RmqOptions;
}