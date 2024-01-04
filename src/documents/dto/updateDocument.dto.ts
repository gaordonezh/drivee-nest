import { IsEnum, IsMongoId, IsOptional, IsString, IsUrl } from 'class-validator';
import { DocumentStatusEnum, DocumentTypesEnum } from '../documents.enum';

export class UpdateDocumentDto {
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
  @IsUrl()
  url?: string;

  @IsOptional()
  @IsEnum(DocumentStatusEnum)
  status?: DocumentStatusEnum;

  @IsOptional()
  @IsString()
  comment?: string;
}
