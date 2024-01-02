import * as AWS from 'aws-sdk';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { v4 as uuidv4 } from 'uuid';
import { UploadFileDto, UploadFileResponseDto } from './files.dto';

@Injectable()
export class FilesService {
  AWS_S3_BUCKET = 'drivee-files';
  s3 = new AWS.S3({
    region: this.configService.getOrThrow('AWS_S3_REGION'),
  });

  constructor(private readonly configService: ConfigService) {}

  async uploadS3File({ name, file, type }: UploadFileDto): Promise<UploadFileResponseDto> {
    const id = uuidv4();
    const parsed = name.split('.');
    const extension = parsed[parsed.length - 1];
    const Key = `${id}.${extension}`;

    const params: AWS.S3.PutObjectRequest = {
      Bucket: this.AWS_S3_BUCKET,
      Key,
      Body: file,
      ContentType: type,
      ACL: 'public-read',
    };

    const response = await this.s3.upload(params).promise();

    return { name: response.Key, url: response.Location, extension };
  }
}
