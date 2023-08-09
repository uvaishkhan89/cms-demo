import { Module } from '@nestjs/common';
import { FileService } from './file.service';
import { FileController } from './file.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { File } from '@models/file.model';
import { ServeStaticModule } from '@nestjs/serve-static';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [
    (SequelizeModule.forFeature([File])),
    ServeStaticModule.forRootAsync({
      useFactory: (config: ConfigService) => [{
        rootPath: config.get('FILES_PATH'),
        serveRoot: config.get('FILES_SERVE_ROOT'),
      }],
      inject: [ConfigService],
    }),
  ],
  controllers: [FileController],
  providers: [FileService],
  exports: [FileService]
})
export class FileModule {}
