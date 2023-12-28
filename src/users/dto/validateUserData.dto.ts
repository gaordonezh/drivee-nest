import { IsOptional, IsString, IsEmail, Length } from 'class-validator';

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
}

export class ValidateUserDataResponseDto {
  email?: boolean;
  phone?: boolean;
  n_doc?: boolean;
}
