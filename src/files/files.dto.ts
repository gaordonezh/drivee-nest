import { IsNotEmpty, IsString } from 'class-validator';

export class UploadFileDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  file: Buffer;

  @IsNotEmpty()
  @IsString()
  type: string;
}

export class UploadFileResponseDto {
  url: string;
  name: string;
  extension: string;
}
