import { IsEnum, IsOptional, IsString } from 'class-validator';
import { BookingStatusEnum } from '../booking.enum';

export class UpdateBookingDto {
  @IsOptional()
  @IsEnum(BookingStatusEnum)
  status?: BookingStatusEnum;

  @IsOptional()
  @IsString()
  comment?: string;
}
