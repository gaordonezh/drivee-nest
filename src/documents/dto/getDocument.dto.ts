import { IsEnum, IsMongoId, IsOptional } from 'class-validator';
import { DocumentStatusEnum, DocumentTypesEnum } from '../documents.enum';
import { PaginationDto } from 'src/utils/dto/globals.dto';

export class GetDocumentsDto extends PaginationDto {
  @IsOptional()
  @IsMongoId()
  idUser?: string;

  @IsOptional()
  @IsMongoId()
  idVehicle?: string;

  @IsOptional()
  @IsEnum(DocumentTypesEnum)
  type?: DocumentTypesEnum;

  @IsOptional()
  @IsEnum(DocumentStatusEnum)
  status?: DocumentStatusEnum;
}
