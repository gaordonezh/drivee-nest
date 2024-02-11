import { Controller, Post, Body, UseGuards, Get, Query, Put, Param } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { BookingService } from './booking.service';
import { CreateBookingDto } from './dto/createBooking.dto';
import { Booking } from './booking.schema';
import { IPaginateResult } from 'typegoose-cursor-pagination';
import { ListBookingDto } from './dto/listBooking.dto';
import { UpdateBookingDto } from './dto/updateBooking.dto';

@UseGuards(JwtAuthGuard)
@Controller('booking')
export class BookingController {
  constructor(private bookingService: BookingService) {}

  @Get()
  list(@Query() params: ListBookingDto): Promise<IPaginateResult<Booking>> {
    return this.bookingService.listBooking(params);
  }

  @Post()
  create(@Body() body: CreateBookingDto): Promise<Record<string, string | boolean>> {
    return this.bookingService.createBooking(body);
  }

  @Put(':id')
  updateStatus(@Param('id') bookingId: string, @Body() body: UpdateBookingDto): Promise<boolean> {
    return this.bookingService.status(bookingId, body);
  }
}
