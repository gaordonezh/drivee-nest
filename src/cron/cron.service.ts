import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { ReturnModelType } from '@typegoose/typegoose';
import { InjectModel } from 'nestjs-typegoose';
import { BookingStatusEnum } from 'src/booking/booking.enum';
import { Booking } from 'src/booking/booking.schema';
import { SendMailService } from 'src/helpers/sendmail/sendmail.service';
import { TemplateNamesEnum } from 'src/helpers/sendmail/template.enum';
import { PaginateModel } from 'typegoose-cursor-pagination';

@Injectable()
export class CronService {
  constructor(
    @InjectModel(Booking)
    private readonly bookingModel: ReturnModelType<typeof Booking> & PaginateModel<Booking, typeof Booking>,
    private readonly sendMailService: SendMailService,
  ) {}

  private readonly logger = new Logger(CronService.name);

  @Cron(CronExpression.EVERY_HOUR)
  async updateCron() {
    try {
      const dateStart = new Date();
      dateStart.setHours(0, 0, 0);
      const dateEnd = new Date();
      dateEnd.setHours(23, 59, 59);

      const toUpdate = await this.bookingModel.find({
        status: BookingStatusEnum.APPROVED,
        startDatetime: { $gte: dateStart, $lte: dateEnd },
      });
      this.logger.debug(
        `Running with ${toUpdate.length} records at from ${dateStart.toISOString()} to ${dateEnd.toISOString()}`,
      );

      if (!toUpdate.length) return;

      for (const current of toUpdate) {
        current.status = BookingStatusEnum.PAYMENT;
        await current.save();

        this.sendMailService.sendEmailWithTemplate({
          email: [current.user.email],
          fields: { vehicle: current.vehicle.name, name: current.user.f_name },
          subject: `¡Es hoy! Tienes una reservación de ${current.vehicle.name}`,
          template: TemplateNamesEnum.PAYMENT_RENT_CAR,
        });
      }
    } catch (error) {
      this.logger.debug('ERROR > ', error);
    }
  }
}
