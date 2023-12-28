import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';

export class LoginAuthDto {
  @IsString()
  user: string;

  @MinLength(4)
  @MaxLength(12)
  password: string;
}

export class CheckTokenDto {
  @IsString()
  @IsNotEmpty()
  token: string;
}
