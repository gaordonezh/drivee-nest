import {
  ArrayNotEmpty,
  ArrayUnique,
  IsBoolean,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
  Length,
  MaxLength,
  MinLength,
} from 'class-validator';
import { UserRolesEnum } from 'src/users/enum/userRoles.enum';

export class LoginAuthDto {
  @IsNotEmpty()
  @IsString()
  user: string;

  @IsNotEmpty()
  @MinLength(4)
  @MaxLength(12)
  password: string;

  @IsOptional()
  @IsBoolean()
  skipBcrypt?: boolean;
}

export class LoginGoogleAuthDto {
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  @Length(3, 50)
  f_name: string;

  @IsNotEmpty()
  @IsString()
  secret: string;

  @IsNotEmpty()
  @IsString()
  provider: string;

  @ArrayNotEmpty()
  @IsEnum(UserRolesEnum, { each: true })
  @ArrayUnique()
  roles: Array<UserRolesEnum>;

  @IsOptional()
  @IsUrl()
  photo?: string;

  @IsOptional()
  @IsString()
  @Length(3, 50)
  l_name?: string;
}
