import { IsEnum, IsMongoId, IsNotEmpty, IsOptional, IsUrl } from 'class-validator';
import { DocumentTypesEnum } from '../documents.enum';

export class CreateDocumentDto {
  @IsOptional()
  @IsMongoId()
  idUser?: string;

  @IsOptional()
  @IsMongoId()
  idVehicle?: string;

  @IsNotEmpty()
  @IsEnum(DocumentTypesEnum)
  type: DocumentTypesEnum;

  @IsNotEmpty()
  @IsUrl()
  url: string;
}
