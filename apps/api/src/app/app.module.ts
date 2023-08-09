import { BadRequestException, Module, ValidationPipe } from '@nestjs/common';
import { DatabaseModule } from '@cms-demo/database';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { resolve } from 'path';
import { UsersModule } from '../users/users.module';
import { AuthModule } from '../auth/auth.module';
import { JwtModule } from '../jwt/jwt.module';
import { Sequelize } from 'sequelize-typescript';
import { APP_GUARD, APP_INTERCEPTOR, APP_PIPE } from '@nestjs/core';
import { JwtGuard } from '../jwt/jwt.guard';
import { ResponseInterceptor } from '../common/interceptors/response.interceptor';
import { FileModule } from '../file/file.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: resolve(__dirname, "../.env"),
    }),
    DatabaseModule,
    UsersModule,
    AuthModule,
    JwtModule,
    FileModule
  ],
  providers: [
    ConfigService,
    {
      provide: 'SEQUELIZE',
      useExisting: Sequelize,
    },
    {
      provide: APP_GUARD,
      useClass: JwtGuard,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: ResponseInterceptor,
    },
    {
      provide: APP_PIPE,
      useValue: new ValidationPipe({
        transform: true,
        whitelist: true,
        forbidNonWhitelisted: true,
        transformOptions: {
          enableImplicitConversion: false,
        },
        exceptionFactory: (errors) => {
          const errorMessages = {};
          errors.forEach(error => {
            errorMessages[error.property]= Object.values(error.constraints).join('. ').trim();
          });
          return new BadRequestException(errorMessages);
        }
      }),
    },
  ],
})
export class AppModule {}
