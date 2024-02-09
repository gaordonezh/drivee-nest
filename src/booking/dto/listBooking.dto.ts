import { ArrayUnique, IsEnum, IsMongoId, IsOptional } from 'class-validator';
import { PaginationDto } from 'src/utils/dto/globals.dto';
import { BookingPopulateEnum, BookingStatusEnum } from '../booking.enum';

export class ListBookingDto extends PaginationDto {
  @IsOptional()
  @IsMongoId()
  user?: string;

  @IsOptional()
  @IsMongoId()
  owner?: string;

  @IsOptional()
  @IsEnum(BookingStatusEnum)
  status?: BookingStatusEnum;

  @IsOptional()
  @IsEnum(BookingPopulateEnum, { each: true })
  @ArrayUnique()
  populate?: Array<BookingPopulateEnum>;
}
