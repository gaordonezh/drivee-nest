import { Module } from '@nestjs/common';
import { TypegooseModule } from 'nestjs-typegoose';
import { Documents } from './documents.schema';
import { DocumentsController } from './documents.controller';
import { DocumentsService } from './documents.service';
import { CheckBooleanString } from 'src/utils/checkBooleanString';

@Module({
  imports: [TypegooseModule.forFeature([Documents])],
  controllers: [DocumentsController],
  providers: [DocumentsService, CheckBooleanString],
})
export class DocumentsModule {}
