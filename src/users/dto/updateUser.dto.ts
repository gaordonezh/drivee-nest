import { Type } from 'class-transformer';
import {
  IsOptional,
  IsString,
  IsEmail,
  IsUrl,
  IsEnum,
  IsDateString,
  Length,
  ArrayUnique,
  IsNotEmpty,
} from 'class-validator';
import { AddressModel } from '../model/address.schema';
import { UserTypeDocumentEnum } from '../enum/userTypeDocument.enum';
import { UserSexEnum } from '../enum/userSex.enum';
import { UserRolesEnum } from '../enum/userRoles.enum';

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  @Length(3, 50)
  f_name?: string;

  @IsOptional()
  @IsString()
  @Length(3, 50)
  l_name?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @Length(9, 9)
  phone?: string;

  @IsOptional()
  @IsEnum(UserTypeDocumentEnum)
  t_doc?: UserTypeDocumentEnum;

  @IsOptional()
  @IsString()
  @Length(8, 12)
  n_doc?: string;

  @IsOptional()
  @IsEnum(UserSexEnum)
  sex?: UserSexEnum;

  @IsOptional()
  @Type(() => AddressModel)
  address?: AddressModel;

  @IsOptional()
  @IsEnum(UserRolesEnum, { each: true })
  @ArrayUnique()
  roles?: Array<UserRolesEnum>;

  @IsOptional()
  @IsDateString()
  date_birth?: Date;

  @IsOptional()
  @IsUrl()
  photo?: string;
}

export class UpdateUserPasswordDto {
  @IsNotEmpty()
  @IsString()
  @Length(8, 20)
  current: string;

  @IsNotEmpty()
  @IsString()
  @Length(8, 20)
  new: string;
}
