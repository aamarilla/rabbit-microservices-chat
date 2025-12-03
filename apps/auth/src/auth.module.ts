import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { SharedModule, PostgresDBModule, SharedService, UsersRepository } from '@app/shared';

import { UserEntity } from './user.entity';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { JwtGuard } from './jwt.guard';
import { JwtStrategy } from './jwt-strategy';

@Module({
  imports: [
      //sirve para cargar variables de entorno de manera global en la aplicacion
      ConfigModule.forRoot({
        isGlobal: true,
        envFilePath: './.env'
      }),
      JwtModule.registerAsync({
        imports: [ConfigModule],
        inject: [ConfigService],
        useFactory: (configService:ConfigService) => ({
          secret: configService.get<string>('JWT_SECRET'),
          signOptions: {
            expiresIn: '3600s'
          }
      })}),
      SharedModule,
      PostgresDBModule,
      TypeOrmModule.forFeature([UserEntity]),
    ],
  controllers: [AuthController],
  providers: [
    JwtGuard, 
    JwtStrategy,
    {
      provide: 'AuthServiceInterface',
      useClass: AuthService
    },
    {
      provide: 'UsersRepositoryInterface',
      useClass: UsersRepository
    },
    {
      provide: 'SharedServiceInterface',
      useClass: SharedService
    }
  
  ],
})
export class AuthModule {}
