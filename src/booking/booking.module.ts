import { Module } from '@nestjs/common';
import { TypegooseModule } from 'nestjs-typegoose';
import { CheckBooleanString } from 'src/utils/checkBooleanString';
import { SendMailModule } from 'src/helpers/sendmail/sendmail.module';
import { Vehicles } from 'src/vehicles/models/vehicle.schema';
import { Booking } from './booking.schema';
import { BookingController } from './booking.controller';
import { BookingService } from './booking.service';
import { Users } from 'src/users/model/users.schema';

@Module({
  imports: [TypegooseModule.forFeature([Users, Booking, Vehicles]), SendMailModule],
  controllers: [BookingController],
  providers: [BookingService, CheckBooleanString],
})
export class BookingModule {}
