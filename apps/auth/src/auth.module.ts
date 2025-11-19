import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
      //sirve para cargar variables de entorno de manera global en la aplicacion
      ConfigModule.forRoot({
        isGlobal: true,
        envFilePath: './.env'
      }),
    ],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
