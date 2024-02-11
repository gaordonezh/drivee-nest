import { Module } from '@nestjs/common';
import { TypegooseModule } from 'nestjs-typegoose';
import { SendMailModule } from 'src/helpers/sendmail/sendmail.module';
import { CronService } from './cron.service';
import { Booking } from 'src/booking/booking.schema';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [ScheduleModule.forRoot(), TypegooseModule.forFeature([Booking]), SendMailModule],
  controllers: [],
  providers: [CronService],
})
export class CronModule {}
