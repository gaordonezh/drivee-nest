import { IsNotEmpty, IsOptional, IsString, IsMongoId, ArrayNotEmpty, IsEnum } from 'class-validator';
import { PaginationDto } from 'src/utils/dto/globals.dto';
import { UserRolesEnum } from '../enum/userRoles.enum';

export class UserFiltersDto extends PaginationDto {
  @IsOptional()
  @IsString()
  willcard?: string;

  @IsOptional()
  @IsMongoId()
  user?: string;

  @IsNotEmpty()
  @IsString()
  isActive: string;

  @ArrayNotEmpty()
  @IsOptional()
  @IsEnum(Array<UserRolesEnum>)
  roles: Array<UserRolesEnum>;
}
