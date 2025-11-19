import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
      //sirve para cargar variables de entorno de manera global en la aplicacion
      ConfigModule.forRoot({
        isGlobal: true,
        envFilePath: './.env'
      }),

      TypeOrmModule.forRootAsync({
        imports: [ConfigModule],
        useFactory: (configService: ConfigService) => ({
          type: 'postgres',
          url: configService.get<string>('POSTGRES_URI'),
          // synchronize: true,
        }),
        inject: [ConfigService],
      }), 
    ],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
