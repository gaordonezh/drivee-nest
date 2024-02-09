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

@Injectable()
export class BookingService {
  constructor(
    @InjectModel(Booking)
    private readonly bookingModel: ReturnModelType<typeof Booking> & PaginateModel<Booking, typeof Booking>,
    @InjectModel(Vehicles)
    private readonly vehiclesModel: ReturnModelType<typeof Vehicles> & PaginateModel<Vehicles, typeof Vehicles>,
    @InjectModel(Users)
    private readonly usersModel: ReturnModelType<typeof Users> & PaginateModel<Users, typeof Users>,
    public readonly checkBooleanString: CheckBooleanString,
  ) {}

  async listBooking(params: ListBookingDto): Promise<IPaginateResult<Booking>> {
    try {
      const { next, previous, limit, sortField, sortAscending, user, owner, status, populate } = params;

      const filters: FilterQuery<Booking> = {};
      if (user) filters['user.id'] = user;
      if (owner) filters['vehicle.owner'] = owner;
      if (status) filters.status = status;

      const options: IPaginateOptions = {
        sortField,
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
        status: { $in: [BookingStatusEnum.PENDING, BookingStatusEnum.APPROVED] },
        $or: [
          { startDatetime: { $gte: dateStart, $lte: dateEnd } }, // startDatetime dentro del rango
          { endDatetime: { $gte: dateStart, $lte: dateEnd } }, // endDatetime dentro del rango
          { $and: [{ startDatetime: { $lte: dateStart } }, { endDatetime: { $gte: dateEnd } }] }, // Ambas fechas están dentro del rango
        ],
      });

      if (booking) throw new Error('Vehicle not available');

      body.vehicle.owner = String(vehicle.user.id);
      await this.bookingModel.create(body);

      return { success: true, message: 'Reserva ingresada correctamente' };
    } catch (error) {
      return { success: false, message: error.message };
    }
  }
}
