import { Controller, HttpException, HttpStatus, Post, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { FilesService } from './files.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { UploadFileResponseDto } from './files.dto';

@UseGuards(JwtAuthGuard)
@Controller('files')
export class FilesController {
  constructor(private filesService: FilesService) {}

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  uploadFile(@UploadedFile() file: Express.Multer.File): Promise<UploadFileResponseDto> {
    if (!file) throw new HttpException('File is required', HttpStatus.BAD_REQUEST);

    return this.filesService.uploadS3File({
      name: file.originalname,
      file: file.buffer,
      type: file.mimetype,
    });
  }
}
