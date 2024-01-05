import { IsEmail, IsEnum, IsMongoId, IsNotEmpty, IsOptional, IsString, IsUrl } from 'class-validator';
import { DocumentTypesEnum } from '../documents.enum';

export class CreateDocumentDto {
  @IsOptional()
  @IsMongoId()
  user?: string;

  @IsNotEmpty()
  @IsString()
  username: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsOptional()
  @IsMongoId()
  vehicle?: string;

  @IsNotEmpty()
  @IsEnum(DocumentTypesEnum)
  type: DocumentTypesEnum;

  @IsNotEmpty()
  @IsUrl()
  url: string;
}
