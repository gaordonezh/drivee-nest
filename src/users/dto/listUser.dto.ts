import {
  IsNotEmpty,
  IsOptional,
  IsString,
  IsMongoId,
  ArrayNotEmpty,
  IsEnum,
} from 'class-validator';
import { PaginationDto } from 'src/utils/dto/globals.dto';
import { Users } from '../model/users.schema';
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
  isActive: boolean;

  @ArrayNotEmpty()
  @IsEnum(Array<UserRolesEnum>)
  roles: Array<UserRolesEnum>;
}

export class UserResponseDto {
  hasNext?: boolean;
  hasPrevious?: boolean;
  next?: string;
  previous?: string;
  totalDocs: number;
  docs: Users[];
}
