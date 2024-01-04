import { Controller, Post, Body, UseGuards, Get, Query, Param, Put, Delete } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { DocumentsService } from './documents.service';
import { CreateDocumentDto } from './dto/createDocument.dto';
import { GetDocumentsDto } from './dto/getDocument.dto';
import { IPaginateResult } from 'typegoose-cursor-pagination';
import { Documents } from './documents.schema';
import { UpdateDocumentDto } from './dto/updateDocument.dto';

@UseGuards(JwtAuthGuard)
@Controller('documents')
export class DocumentsController {
  constructor(private documentsService: DocumentsService) {}

  @Get()
  list(@Query() filters: GetDocumentsDto): Promise<IPaginateResult<Documents>> {
    return this.documentsService.getDocuments(filters);
  }

  @Post()
  create(@Body() body: CreateDocumentDto): Promise<boolean> {
    return this.documentsService.createDocument(body);
  }

  @Put(':document')
  update(@Param('document') docId: string, @Body() body: UpdateDocumentDto): Promise<boolean> {
    return this.documentsService.updateDocument(docId, body);
  }

  @Delete(':document')
  delete(@Param('document') docId: string): Promise<boolean> {
    return this.documentsService.deleteDocument(docId);
  }
}
