import { Injectable, Logger } from '@nestjs/common'; 
import { File } from '@models/file.model';
import {ConfigService } from '@nestjs/config';
import { S3 } from 'aws-sdk';
import * as sharp from 'sharp';
import * as fs from 'fs';
import { join } from 'path';
import { InjectModel } from '@nestjs/sequelize';
import { UpdateFileDto } from './dto/update-file.dto';
import { Storage } from '@google-cloud/storage';
import { S3Client, DeleteObjectCommand, ListObjectsCommand, ListObjectsV2Command } from '@aws-sdk/client-s3';
 

@Injectable()
export class FileService {
  constructor(
    @InjectModel(File) private readonly file : typeof File,  
    private config: ConfigService
  ){}   

  getS3() {
    return new S3({
      accessKeyId: this.config.get('S3_ACCESS_KEY_ID'),
      secretAccessKey: this.config.get('S3_SECRET_ACCESS_KEY'),
      region: this.config.get('S3_REGION')
    });
  }

  gcpBucket() {
    return new Storage({
      projectId: this.config.get('GCP_PROJECT_ID'),
      credentials: {
        client_email: this.config.get('GCP_CLIENT_EMAIL'),
        private_key: this.config.get('GCP_PRIVATE_KEY')
      }
    });
  }

  async uploadFile(buffer, name) {
    const filePath = this.config.get('FILES_PATH');
    const current_os = this.config.get('CURRENT_OS');    
    const path = join(filePath, name);   
    const parts=current_os=='Linux'? path.split('/'):path.split('\\')    
    parts.pop();
    const dir=current_os=='Linux'? parts.join('/'):parts.join('\\')      
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.createWriteStream(path).write(buffer);
    return path;
  }

  async uploadS3(buffer, name) {
    const params = {
      Bucket: this.config.get('S3_BUCKET'),
      Key: this.config.get('S3_DIRECTORY') + name,
      Body: buffer,
    };
    const s3 = this.getS3();
    const res = await new Promise(function (resolve, reject) {
      s3.upload(params, function (err, data) {
        if (err) {
          Logger.error(err);
          reject(err.message);
        }
        resolve(data);
      });
    });
    return res;
  }

  async uploadGCP(buffer, name) {
    const storage = this.gcpBucket();
    const bucketName = this.config.get('GCP_BUCKET');
    const file = storage.bucket(bucketName).file(name);
  
    console.log(buffer, 'buffer111111111111111111111111111111', name, 'name22222222222222222222222222222');
  
    const metadata = buffer.metadata || []; // Handle undefined metadata
  
    const writeStream = file.createWriteStream({
      metadata: {
        contentType: buffer.contentType,
        metadata: metadata.reduce((obj, item) => Object.assign(obj, item), {}),
      },
    });
  
    return new Promise<void>((resolve, reject) => {
      writeStream
        .on('error', (err) => {
          Logger.error(err);
          reject(err);
        })
        .on('finish', () => {
          resolve();
        })
        .end(buffer);
    });
  }
  
  

  // async uploadFileToGCS(buffer, name) {
  //   const storage = this.gcpBucket();
  //   const bucketName = this.config.get('GCP_BUCKET');
  //   const bucket = storage.bucket(bucketName);
  //   console.log('hii');
  //   const uploadResponse = await bucket.upload(name);
  //   console.log(uploadResponse, 'hii111');
  //   const fileLink = `https://storage.cloud.google.com/${bucketName}/${name}`;
  //   return fileLink;
  // }

  async getResizedImage(buffer, type) {
    const image = await sharp(buffer);
    const metadata = await image.metadata();
    const width = metadata.width;
    const height = metadata.height;
    const newWidth = parseInt(this.config.get(type));
    const newHeight = Math.floor((height / width) * newWidth);
    if (width > newWidth || height > newHeight) {
      const newBuffer = await sharp(buffer)
        .resize(newWidth, newHeight)
        .toBuffer();
      const image = await sharp(buffer);
      const metadata = await image.metadata();
      return {
        buffer: newBuffer,
        width: newWidth,
        height: newHeight,
        size: metadata.size,
      };
    }
    return {
      buffer,
      width,
      height,
      size: metadata.size,
    };
  }

  addUrls = (file) => {
    const urls = { disk: {}, bucket: {} };
    const STORAGE = this.config.get('STORAGE');
    const S3_URL = this.config.get('S3_URL');
    const GCP_URL = this.config.get('GCP_URL');
    const S3_DIRECTORY = this.config.get('S3_DIRECTORY');
    const FILES_SERVE_ROOT = this.config.get('FILES_SERVE_ROOT');
    const FILES_BASE_URL = this.config.get('FILES_BASE_URL');

    const paths = file.paths.split(',');
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
      if (STORAGE === 'S3' || STORAGE === 'BOTH') {
        urls.bucket['file'] = S3_URL + S3_DIRECTORY + paths[0];
        paths.forEach((f, i) => {
          urls.bucket[['large', 'medium', 'small'][i]] =
            S3_URL + S3_DIRECTORY + f;
        });
      }
      if (STORAGE === 'GCP') {
        urls.bucket['file'] = GCP_URL + paths[0];
        paths.forEach((f, i) => {
          urls.bucket[['large', 'medium', 'small'][i]] =
            GCP_URL + f;
        });
      }
      if (STORAGE === 'DISK' || STORAGE === 'BOTH') {
        urls.disk['file'] = FILES_BASE_URL + FILES_SERVE_ROOT + '/' + paths[0];
        paths.forEach((f, i) => {
          urls.disk[['large', 'medium', 'small'][i]] =
            FILES_BASE_URL + FILES_SERVE_ROOT + '/' + f;
        });
      }
    }
    else {
      if (STORAGE === 'S3' || STORAGE === 'BOTH') {
        urls.bucket['file'] = S3_URL + S3_DIRECTORY + paths[0];
      }
      if (STORAGE === 'DISK' || STORAGE === 'BOTH') {
        urls.disk['file'] = FILES_BASE_URL + FILES_SERVE_ROOT + '/' + paths[0];
      }
    }
    file.urls = urls;
    return file;
  };

  async saveToDestination(buffer, fileName, id) {
    const storage = this.config.get('STORAGE');
    if (storage === 'S3' || storage === 'BOTH') {
      await this.uploadS3(buffer, `${id}/${fileName}`);
    }
    if (storage == 'GCP') {
      await this.uploadGCP(buffer, `${id}/${fileName}`);
    }
    if (storage === 'DISK' || storage === 'BOTH') {
      this.uploadFile(buffer, `${id}/${fileName}`);
    }
    return `${id}/${fileName}`;
  }

  async upload(file, user_id) {
    let sizeBase = file.size;
    const extension = file.originalname.split('.').pop().toLowerCase();
    const name = file.originalname;
    let paths = [];
    let width = null;
    let height = null;
    const fileRecord = await File.create({
      name: name,
      extension: extension,
      mimetype: file.mimetype,
      createdBy: user_id,
    });
    const id = fileRecord.id;
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
      const large = await this.getResizedImage(
        file.buffer,
        'IMAGE_WIDTH_LARGE'
      );
      sizeBase = large.size;
      width = large.width;
      height = large.height;
      const medium = await this.getResizedImage(
        file.buffer,
        'IMAGE_WIDTH_MEDIUM'
      );
      const small = await this.getResizedImage(
        file.buffer,
        'IMAGE_WIDTH_SMALL'
      );
      const pathLarge = await this.saveToDestination(
        large.buffer,
        `large.${extension}`,
        id
      );
      const pathMedium = await this.saveToDestination(
        medium.buffer,
        `medium.${extension}`,
        id
      );
      const pathSmall = await this.saveToDestination(
        small.buffer,
        `small.${extension}`,
        id
      );
      paths = [pathLarge, pathMedium, pathSmall];
    } else {
      const path = await this.saveToDestination(
        file.buffer,
        `file.${extension}`,
        id
      );
      paths = [path];
    }
    const update = {
      size: sizeBase,
      width: width,
      height: height,
      paths: paths.join(','),
    };
    await this.file.update(update, { where: { id: id } });
    const f = await this.file.findByPk(id);
    return this.addUrls(f);
  }

  findAll() {
    return this.file.findAll();
  }

  findOne(id: number) {
    return this.file.findByPk(id);
  }

  update(id: number, updateUserDto: UpdateFileDto) {
    return this.file.update(updateUserDto, {
      where: { id }
    });
  }

  remove(id: number) {
    return this.file.destroy({
      where: { id },
      force: true
    });
  }
  
  public async deleteFileFromS3(folderKey: string): Promise<any> {
    const s3 = this.getS3();
    const listParams = {
      Bucket: process.env.S3_BUCKET,
      Prefix: `Mystuff/${folderKey}/`
    };

    const listedObjects = await s3.listObjectsV2(listParams).promise();

    if (listedObjects.Contents.length === 0) return;

    const deleteParams = {
      Bucket: process.env.S3_BUCKET,
      Delete: { Objects: [] }
    };

    listedObjects.Contents.forEach(({ Key }) => {
      deleteParams.Delete.Objects.push({ Key });
    });

    await s3.deleteObjects(deleteParams).promise();
  }
}