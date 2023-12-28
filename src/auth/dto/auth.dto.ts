import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';

export class LoginAuthDto {
  @IsNotEmpty()
  @IsString()
  user: string;

  @IsNotEmpty()
  @MinLength(4)
  @MaxLength(12)
  password: string;
}
