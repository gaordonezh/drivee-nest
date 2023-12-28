import { IsString, IsMongoId } from 'class-validator';

export class DeleteParamUserDto {
  @IsMongoId()
  @IsString()
  user: string;
}
