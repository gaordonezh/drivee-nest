import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { IPaginateOptions, IPaginateResult, PaginateModel } from 'typegoose-cursor-pagination';
import { CheckBooleanString } from '../utils/checkBooleanString';
import { ReturnModelType } from '@typegoose/typegoose';
import { InjectModel } from 'nestjs-typegoose';
import { Booking } from './booking.schema';
import { CreateBookingDto } from './dto/createBooking.dto';
import { Vehicles } from 'src/vehicles/models/vehicle.schema';
import { VehicleStatusEnum } from 'src/vehicles/vehicle.enum';
import { BookingPopulateEnum, BookingStatusEnum } from './booking.enum';
import { ListBookingDto } from './dto/listBooking.dto';
import { FilterQuery } from 'mongoose';
import { Users } from 'src/users/model/users.schema';
import { UpdateBookingDto } from './dto/updateBooking.dto';
import { SendMailService } from 'src/helpers/sendmail/sendmail.service';
import { TemplateNamesEnum } from 'src/helpers/sendmail/template.enum';

@Injectable()
export class BookingService {
  constructor(
    @InjectModel(Booking)
    private readonly bookingModel: ReturnModelType<typeof Booking> & PaginateModel<Booking, typeof Booking>,
    @InjectModel(Vehicles)
    private readonly vehiclesModel: ReturnModelType<typeof Vehicles> & PaginateModel<Vehicles, typeof Vehicles>,
    @InjectModel(Users)
    private readonly usersModel: ReturnModelType<typeof Users> & PaginateModel<Users, typeof Users>,
    private readonly sendMailService: SendMailService,
    public readonly checkBooleanString: CheckBooleanString,
  ) {}

  async listBooking(params: ListBookingDto): Promise<IPaginateResult<Booking>> {
    try {
      const { next, previous, limit, sortField, sortAscending, user, owner, status, populate } = params;

      const filters: FilterQuery<Booking> = {};
      if (user) filters['user.id'] = user;
      if (owner) filters['vehicle.owner'] = owner;
      if (status) filters.status = status;

      const _sortField = sortField ?? 'updatedAt';

      const options: IPaginateOptions = {
        sortField: _sortField,
        sortAscending: this.checkBooleanString.parseBoolean(sortAscending),
        limit,
        next,
        previous,
      };

      const projection = {
        createdAt: 0,
        updatedAt: 0,
        __v: 0,
      };

      const populateOptions = [];
      if (Array.isArray(populate)) {
        if (populate.includes(BookingPopulateEnum.OWNER)) {
          populateOptions.push({ model: this.usersModel, path: 'vehicle.owner', select: 'f_name l_name email phone photo' });
        }
      }

      return this.bookingModel.findPaged(options, filters, projection, populateOptions);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST, { cause: new Error(error) });
    }
  }

  async createBooking(body: CreateBookingDto): Promise<Record<string, string | boolean>> {
    try {
      // VEHICLE VALIDATIONS
      const vehicle = await this.vehiclesModel.findById(body.vehicle.id);
      if (!vehicle) throw new Error('Vehicle not found');
      if (vehicle.status !== VehicleStatusEnum.AVAILABLE) throw new Error('Vehicle not available');

      // BOOKING VALIDATIONS
      const dateStart = new Date(body.startDatetime);
      dateStart.setHours(0, 0, 0);
      dateStart.setDate(dateStart.getDate() - 1);
      const dateEnd = new Date(body.endDatetime);
      dateEnd.setHours(23, 59, 59);

      const booking = await this.bookingModel.findOne({
        'vehicle.id': body.vehicle.id,
        status: {
          $in: [
            BookingStatusEnum.PENDING,
            BookingStatusEnum.APPROVED,
            BookingStatusEnum.IN_PROCCESS,
          ],
        },
        $or: [
          { startDatetime: { $gte: dateStart, $lte: dateEnd } }, // startDatetime dentro del rango
          { endDatetime: { $gte: dateStart, $lte: dateEnd } }, // endDatetime dentro del rango
          { $and: [{ startDatetime: { $lte: dateStart } }, { endDatetime: { $gte: dateEnd } }] }, // Ambas fechas están dentro del rango
        ],
      });

      if (booking) throw new Error('Vehicle not available');

      body.vehicle.owner = String(vehicle.user.id);
      await this.bookingModel.create(body);

      this.sendMailService.sendEmailWithTemplate({
        email: [vehicle.user.email, body.user.email],
        fields: {
          vehicle: vehicle.name,
          from: body.startDatetime,
          to: body.endDatetime,
          hours: body.totalHours,
          total: body.totalPrice,
        },
        subject: `Tienes una reservación pendiente de ${vehicle.name}`,
        template: TemplateNamesEnum.PENDING_RENT_CAR,
      });

      return { success: true, message: 'Reserva ingresada correctamente' };
    } catch (error) {
      return { success: false, message: error.message };
    }
  }

  async status(bookingId: string, body: UpdateBookingDto): Promise<boolean> {
    try {
      const toUpdate: UpdateBookingDto = {};
      if (body.status) toUpdate.status = body.status;
      if (body.comment) toUpdate.comment = body.comment;

      const res = await this.bookingModel.findByIdAndUpdate(bookingId, { $set: toUpdate });
      console.log(res);

      if (body.status === BookingStatusEnum.REJECTED) {
        this.sendMailService.sendEmailWithTemplate({
          email: [res.user.email],
          fields: { name: res.user.f_name, vehicle: res.vehicle.name, comment: body.comment },
          subject: `La solicitud de reserva de ${res.vehicle.name} fue rechazada`,
          template: TemplateNamesEnum.REJECTED_RENT_CAR,
        });
      }

      if (body.status === BookingStatusEnum.APPROVED) {
        this.sendMailService.sendEmailWithTemplate({
          email: [res.user.email],
          fields: {
            name: res.user.f_name,
            vehicle: res.vehicle.name,
            comment: body.comment,
            from: String(res.startDatetime),
            to: String(res.endDatetime),
          },
          subject: `La solicitud de reserva de ${res.vehicle.name} fue aprobada`,
          template: TemplateNamesEnum.APPROVED_RENT_CAR,
        });
      }

      return true;
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST, { cause: new Error(error) });
    }
  }
}
