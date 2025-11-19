import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ClientProxy, ClientProxyFactory, Transport } from '@nestjs/microservices';

@Module({
  imports: [
    //sirve para cargar variables de entorno de manera global en la aplicacion
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: './.env'
    }),
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide:'AUTH_SERVICE',
      useFactory: (configService:ConfigService) => {
        const USER = configService.get<string>('RABBITMQ_USER');
        const PASSWORD = configService.get<string>('RABBITMQ_PASSWORD');
        const HOST = configService.get<string>('RABBITMQ_HOST');
        const QUEUE_AUTH = configService.get<string>('RABBITMQ_AUTH_QUEUE');
        return ClientProxyFactory.create({
          transport: Transport.RMQ,
          options: {
            urls: [`amqp://${USER}:${PASSWORD}@${HOST}`],
            queue: QUEUE_AUTH,
            queueOptions: {
              durable: true,
            },
          }
        })
      },
      inject: [ConfigService]
    }
  ],
})
export class AppModule {}
