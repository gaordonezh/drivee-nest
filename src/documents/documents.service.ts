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
import { Users } from 'src/users/model/users.schema';
import { DocumentPopulateEnum, DocumentStatusEnum } from './documents.enum';
import { SendMailService } from 'src/helpers/sendmail/sendmail.service';
import { TemplateNamesEnum } from 'src/helpers/sendmail/template.enum';
import { Vehicles } from 'src/vehicles/models/vehicle.schema';

@Injectable()
export class DocumentsService {
  constructor(
    @InjectModel(Documents)
    private readonly documentsModel: ReturnModelType<typeof Documents> & PaginateModel<Documents, typeof Documents>,
    @InjectModel(Users)
    private readonly usersModel: ReturnModelType<typeof Users> & PaginateModel<Users, typeof Users>,
    @InjectModel(Vehicles)
    private readonly vehiclesModel: ReturnModelType<typeof Vehicles> & PaginateModel<Vehicles, typeof Vehicles>,
    private readonly checkBooleanString: CheckBooleanString,
    private readonly sendMailService: SendMailService,
  ) {}

  async getDocuments(params: GetDocumentsDto): Promise<IPaginateResult<Documents>> {
    try {
      const { next, previous, limit, sortField, sortAscending, user, vehicle, type, status, populate } = params;
      const filters: FilterQuery<Documents> = { isActive: true };

      if (type) filters.type = type;
      if (status) filters.status = status;
      if (user) filters.user = user;
      if (vehicle) filters.vehicle = vehicle;

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

      const populateOptions = [];
      if (Array.isArray(populate)) {
        if (populate.includes(DocumentPopulateEnum.USER)) {
          const selectFields = 'f_name l_name email t_doc n_doc phone photo';
          populateOptions.push({ model: this.usersModel, path: 'user', select: selectFields });
        }
        if (populate.includes(DocumentPopulateEnum.VEHICLE)) {
          populateOptions.push({ model: this.vehiclesModel, path: 'vehicle', select: 'name images status user' });
        }
      }

      return await this.documentsModel.findPaged(options, filters, projection, populateOptions);
    } catch (error) {
      throw new HttpException(error, HttpStatus.BAD_REQUEST, { cause: new Error('Validation') });
    }
  }

  async createDocument(body: CreateDocumentDto): Promise<boolean> {
    try {
      await this.documentsModel.create(body);
      if (body.skip) return true;
      this.sendMailService.sendEmailWithTemplate({
        email: ['gaordonezh@gmail.com', body.email],
        fields: {
          status: DocumentStatusEnum.REVIEW,
          type: body.type,
          comment: '',
          name: body.username,
          documents: body.documents,
        },
        subject: 'Revisión de documentos',
        template: TemplateNamesEnum.REVIEW_DOCUMENT,
      });
      return true;
    } catch (error) {
      throw new HttpException(error, HttpStatus.BAD_REQUEST, { cause: new Error('Validation') });
    }
  }

  async updateDocument(docId: string, body: UpdateDocumentDto): Promise<boolean> {
    try {
      const result = await this.documentsModel.findByIdAndUpdate(docId, {
        $set: { status: body.status, comment: body.comment },
      });

      this.sendMailService.sendEmailWithTemplate({
        email: [body.email, ...(body.status === DocumentStatusEnum.REVIEW ? ['gaordonezh@gmail.com'] : [])],
        fields: { status: body.status, type: result.type, comment: body.comment || '', name: body.username },
        subject: 'Revisión de documentos',
        template: TemplateNamesEnum.REVIEW_DOCUMENT,
      });

      return true;
    } catch (error) {
      throw new HttpException(error, HttpStatus.BAD_REQUEST, { cause: new Error('Validation') });
    }
  }

  async deleteDocument(docId: string): Promise<boolean> {
    try {
      await this.documentsModel.findByIdAndUpdate(docId, { isActive: false });
      return true;
    } catch (error) {
      throw new HttpException(error, HttpStatus.BAD_REQUEST, { cause: new Error('Validation') });
    }
  }
}
