import { IsEmail, IsEnum, IsMongoId, IsNotEmpty, IsOptional, IsString, IsUrl } from 'class-validator';
import { DocumentStatusEnum, DocumentTypesEnum } from '../documents.enum';

export class UpdateDocumentDto {
  @IsOptional()
  @IsMongoId()
  user?: string;

  @IsOptional()
  @IsMongoId()
  vehicle?: string;

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

  @IsNotEmpty()
  @IsString()
  username: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;
}
