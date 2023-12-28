import { Type } from 'class-transformer';
import {
  IsNotEmpty,
  IsOptional,
  IsString,
  IsEmail,
  IsUrl,
  IsEnum,
  IsDateString,
  ArrayNotEmpty,
  ValidateNested,
  Length,
  ArrayUnique,
} from 'class-validator';
import { AddressModel } from '../model/address.schema';
import { UserTypeDocumentEnum } from '../enum/userTypeDocument.enum';
import { UserSexEnum } from '../enum/userSex.enum';
import { UserRolesEnum } from '../enum/userRoles.enum';

export class CreateUserDto {
  @IsNotEmpty()
  @IsString()
  @Length(3, 50)
  f_name: string;

  @IsOptional()
  @IsString()
  @Length(3, 50)
  l_name?: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

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
  @ValidateNested({ each: true })
  @Type(() => AddressModel)
  address?: AddressModel;

  @ArrayNotEmpty()
  @IsEnum(UserRolesEnum, { each: true })
  @ArrayUnique()
  roles: Array<UserRolesEnum>;

  @IsOptional()
  @IsDateString()
  date_birth?: Date;

  @IsOptional()
  @IsUrl()
  photo?: string;
}

export class CreatePasswordDto {
  @IsNotEmpty()
  @IsString()
  token: string;

  @IsNotEmpty()
  @IsString()
  password: string;
}
