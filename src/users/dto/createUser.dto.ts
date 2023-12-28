import { Type } from 'class-transformer';
import {
  IsNotEmpty,
  IsOptional,
  IsString,
  IsBoolean,
  IsEmail,
  IsUrl,
  MinLength,
  MaxLength,
  IsEnum,
  IsDateString,
  ArrayNotEmpty,
  ValidateNested,
} from 'class-validator';
import { AddressModel } from '../model/address.schema';
import { UserTypeDocumentEnum } from '../enum/userTypeDocument.enum';
import { UserSexEnum } from '../enum/userSex.enum';
import { UserRolesEnum } from '../enum/userRoles.enum';

export class CreateUserDto {
  @IsNotEmpty()
  @IsString()
  f_name: string;

  @IsNotEmpty()
  @IsString()
  l_name: string;

  @IsNotEmpty()
  @IsString()
  @IsEnum(UserTypeDocumentEnum)
  t_doc: UserTypeDocumentEnum;

  @IsNotEmpty()
  @IsString()
  @MinLength(8)
  @MaxLength(12)
  n_doc: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsOptional()
  @IsNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => AddressModel)
  address: AddressModel;

  @IsOptional()
  @MinLength(6)
  phone: string;

  @IsOptional()
  @MinLength(6)
  cellphone: string;

  @IsOptional()
  @IsUrl()
  photo: string;

  @IsOptional()
  @IsEnum(UserSexEnum)
  sex: UserSexEnum;

  @IsDateString()
  @IsOptional()
  date_birth: Date;

  @ArrayNotEmpty()
  @IsEnum(Array<UserRolesEnum>)
  roles: Array<UserRolesEnum>;

  @IsBoolean()
  @IsOptional()
  isActive: boolean;
}
