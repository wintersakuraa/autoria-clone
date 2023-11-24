import { extname } from 'path';

import {
  DeleteObjectCommand,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';
import { Injectable, Logger } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';

import { s3Config } from '@/configs';

import { S3_BUCKET } from '@common/constants/s3.constants';

import { FileItemType } from './s3.enums';

@Injectable()
export class S3Service {
  private logger = new Logger(S3Service.name);
  private readonly s3Client = new S3Client(s3Config);

  async upload(
    file: Express.Multer.File,
    itemType: FileItemType,
    itemId: string,
  ): Promise<string> {
    try {
      const filePath = this.buildPath(file.originalname, itemType, itemId);

      await this.s3Client.send(
        new PutObjectCommand({
          Bucket: S3_BUCKET,
          Key: filePath,
          Body: file.buffer,
          ContentType: file.mimetype,
          ACL: 'public-read',
        }),
      );

      return filePath;
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }

  async delete(fileKey: string): Promise<void> {
    try {
      await this.s3Client.send(
        new DeleteObjectCommand({
          Bucket: S3_BUCKET,
          Key: fileKey,
        }),
      );
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }

  private buildPath(filenName: string, fileType: FileItemType, itemId: string) {
    return `${fileType}/${itemId}/${uuidv4()}${extname(filenName)}`;
  }
}
