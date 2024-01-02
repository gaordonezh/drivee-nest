import { IsOptional, IsString, IsEmail, Length, IsMongoId } from 'class-validator';

export class ValidateUserDataDto {
  @IsOptional()
  @IsEmail()
  email: string;

  @IsOptional()
  @IsString()
  @Length(9, 9)
  phone: string;

  @IsOptional()
  @IsString()
  @Length(8, 12)
  n_doc: string;

  @IsOptional()
  @IsMongoId()
  user?: boolean;
}

export class ValidateUserDataResponseDto {
  email?: boolean;
  phone?: boolean;
  n_doc?: boolean;
}
