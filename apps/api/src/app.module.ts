import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ClientProxy, ClientProxyFactory, Transport } from '@nestjs/microservices';
import { SharedModule } from '@app/shared';

@Module({
  imports: [
    //sirve para cargar variables de entorno de manera global en la aplicacion
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: './.env'
    }),
    SharedModule.registerRmq('AUTH_SERVICE', process.env.RABBITMQ_AUTH_QUEUE!),
    SharedModule.registerRmq('PRESENCE_SERVICE', process.env.RABBITMQ_PRESENCE_QUEUE!),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
