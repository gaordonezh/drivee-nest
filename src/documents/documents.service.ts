import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { IPaginateOptions, IPaginateResult, PaginateModel } from 'typegoose-cursor-pagination';
import { ReturnModelType } from '@typegoose/typegoose';
import { InjectModel } from 'nestjs-typegoose';
import { Documents } from './documents.schema';
import { CreateDocumentDto } from './dto/createDocument.dto';
import { GetDocumentsDto } from './dto/getDocument.dto';
import { FilterQuery } from 'mongoose';
import { CheckBooleanString } from 'src/utils/checkBooleanString';
import { UpdateDocumentDto } from './dto/updateDocument.dto';

@Injectable()
export class DocumentsService {
  constructor(
    @InjectModel(Documents)
    private readonly documentsModel: ReturnModelType<typeof Documents> & PaginateModel<Documents, typeof Documents>,
    private readonly checkBooleanString: CheckBooleanString,
  ) {}

  async getDocuments(params: GetDocumentsDto): Promise<IPaginateResult<Documents>> {
    try {
      const { next, previous, limit, sortField, sortAscending, idUser, idVehicle, type, status } = params;
      const filters: FilterQuery<Documents> = { isActive: true };

      if (type) filters.type = type;
      if (status) filters.status = status;
      if (idUser) filters.idUser = idUser;
      if (idVehicle) filters.idVehicle = idVehicle;

      const _sortAscending = this.checkBooleanString.parseBoolean(sortAscending);

      const options: IPaginateOptions = {
        sortField,
        sortAscending: _sortAscending,
        limit,
        next,
        previous,
      };

      const projection = {
        isActive: 0,
        createdAt: 0,
        updatedAt: 0,
        __v: 0,
      };

      return await this.documentsModel.findPaged(options, filters, projection);
    } catch (error) {
      throw new HttpException(error, HttpStatus.BAD_REQUEST, { cause: new Error('Validation') });
    }
  }

  async createDocument(body: CreateDocumentDto): Promise<boolean> {
    try {
      await this.documentsModel.create(body);
      return true;
    } catch (error) {
      throw new HttpException(error, HttpStatus.CONFLICT, { cause: new Error('Validation') });
    }
  }

  async updateDocument(docId: string, body: UpdateDocumentDto): Promise<boolean> {
    try {
      await this.documentsModel.findByIdAndUpdate(docId, { $set: body });
      return true;
    } catch (error) {
      throw new HttpException(error, HttpStatus.CONFLICT, { cause: new Error('Validation') });
    }
  }

  async deleteDocument(docId: string): Promise<boolean> {
    try {
      await this.documentsModel.findByIdAndUpdate(docId, { isActive: false });
      return true;
    } catch (error) {
      throw new HttpException(error, HttpStatus.CONFLICT, { cause: new Error('Validation') });
    }
  }
}
