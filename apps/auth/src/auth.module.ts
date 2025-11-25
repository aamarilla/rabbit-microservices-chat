import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './user.entity';
import { dataSourceOptions } from './db/data-source';

@Module({
  imports: [
      //sirve para cargar variables de entorno de manera global en la aplicacion
      ConfigModule.forRoot({
        isGlobal: true,
        envFilePath: './.env'
      }),

      TypeOrmModule.forRootAsync({
        imports: [ConfigModule],
        // useFactory: (configService: ConfigService) => ({
        //   type: 'postgres',
        //   url: configService.get<string>('POSTGRES_URI'),
        //   autoLoadEntities: true,
        //   synchronize: true, //solo en desarrollo
        // }),
        useFactory: ()=> ({
          ...dataSourceOptions,
          autoLoadEntities: true,
          synchronize: true, //solo en desarrollo
        }),
        inject: [ConfigService],
      }),
      TypeOrmModule.forFeature([UserEntity]),
    ],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
