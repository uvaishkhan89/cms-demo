import {
  Request,
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileService } from './file.service';
import { CreateFileDto } from './dto/create-file.dto';
import { UpdateFileDto } from './dto/update-file.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { File } from '@models/file.model';

@Controller('file')
export class FileController {
  constructor(private readonly fileService: FileService) {}

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  upload(@UploadedFile() createFileDto: CreateFileDto, @Request() req) {
    const { user } = req;
    return this.fileService.upload(createFileDto, user.id);
  }

  @Get()
  findAll() {
    return this.fileService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.fileService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateFileDto: UpdateFileDto) {
    return this.fileService.update(+id, updateFileDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    const file = await File.findByPk(id)
    if (!file) throw new Error('File not found.');
    await this.fileService.deleteFileFromS3(id);
    await file.destroy();
  }
}
