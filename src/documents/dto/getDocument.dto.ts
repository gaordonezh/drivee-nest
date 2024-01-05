import { ArrayUnique, IsEnum, IsMongoId, IsOptional } from 'class-validator';
import { DocumentPopulateEnum, DocumentStatusEnum, DocumentTypesEnum } from '../documents.enum';
import { PaginationDto } from 'src/utils/dto/globals.dto';

export class GetDocumentsDto extends PaginationDto {
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
  @IsEnum(DocumentStatusEnum)
  status?: DocumentStatusEnum;

  @IsOptional()
  @IsEnum(DocumentPopulateEnum, { each: true })
  @ArrayUnique()
  populate?: Array<DocumentPopulateEnum>;
}
