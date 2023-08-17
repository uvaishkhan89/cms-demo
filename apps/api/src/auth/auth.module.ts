import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { UsersModule } from '../users/users.module';
import { APPLICATION_NAME } from '../common/constants/user.constant';

@Module({
  imports: [
    SequelizeModule.forFeature([], APPLICATION_NAME)
  ],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
