import { Type } from 'class-transformer';
import {
  IsOptional,
  IsString,
  IsBoolean,
  IsEmail,
  IsUrl,
  MinLength,
  MaxLength,
  IsEnum,
  IsDateString,
  ValidateNested,
  IsMongoId,
} from 'class-validator';
import { AddressModel } from '../model/address.schema';
import { UserTypeDocumentEnum } from '../enum/userTypeDocument.enum';
import { UserSexEnum } from '../enum/userSex.enum';
import { UserRolesEnum } from '../enum/userRoles.enum';

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  f_name: string;

  @IsOptional()
  @IsString()
  l_name: string;

  @IsOptional()
  @IsEnum(UserTypeDocumentEnum)
  t_doc: UserTypeDocumentEnum;

  @IsOptional()
  @IsString()
  @MinLength(8)
  @MaxLength(12)
  n_doc: string;

  @IsOptional()
  @IsEmail()
  email: string;

  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => AddressModel)
  address: AddressModel;

  @IsOptional()
  @IsString()
  @MinLength(6)
  phone: string;

  @IsOptional()
  @IsUrl()
  @IsString()
  photo: string;

  @IsOptional()
  @IsEnum(UserSexEnum)
  sex: UserSexEnum;

  @IsOptional()
  @IsDateString()
  date_birth: Date;

  @IsOptional()
  @IsEnum(Array<UserRolesEnum>)
  roles: Array<UserRolesEnum>;

  @IsBoolean()
  @IsOptional()
  isActive: boolean;
}

export class UpdateParamUserDto {
  @IsMongoId()
  @IsString()
  user: string;
}
