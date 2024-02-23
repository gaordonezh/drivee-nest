import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { IPaginateOptions, IPaginateResult, PaginateModel } from 'typegoose-cursor-pagination';
import { CheckBooleanString } from '../utils/checkBooleanString';
import { ReturnModelType } from '@typegoose/typegoose';
import { InjectModel } from 'nestjs-typegoose';
import { Vehicles } from './models/vehicle.schema';
import { CreateVehicleDto } from './dto/createVehicle.dto';
import { UpdateVehicleDto } from './dto/updateVehicle.dto';
import { FilterQuery } from 'mongoose';
import { GetPublicVehiclesDto, GetVehiclesDto } from './dto/getVehicles.dto';
import { VehicleStatusEnum } from './vehicle.enum';
import { Booking } from 'src/booking/booking.schema';
import { BookingStatusEnum } from 'src/booking/booking.enum';

@Injectable()
export class VehiclesService {
  constructor(
    @InjectModel(Vehicles)
    private readonly vehiclesService: ReturnModelType<typeof Vehicles> & PaginateModel<Vehicles, typeof Vehicles>,
    @InjectModel(Booking)
    private readonly bookingService: ReturnModelType<typeof Booking> & PaginateModel<Booking, typeof Booking>,
    public readonly checkBooleanString: CheckBooleanString,
  ) {}

  deg2rad(deg: number): number {
    return deg * (Math.PI / 180);
  }

  getDistanceFromLatLonInMts(coordinates1: number[], coordinates2: number[], unit: 'm' | 'km' = 'km'): number {
    const [lon1, lat1] = coordinates1;
    const [lon2, lat2] = coordinates2;
    const R = 6371; // Earth radius in km
    const dLat = this.deg2rad(lat2 - lat1);
    const dLon = this.deg2rad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.deg2rad(lat1)) * Math.cos(this.deg2rad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    let distance = R * c;
    if (unit === 'm') {
      distance *= 1000;
    }
    return distance;
  }

  async getPublicVehicles(params: GetPublicVehiclesDto): Promise<IPaginateResult<Vehicles>> {
    try {
      const {
        next,
        previous,
        limit,
        sortField,
        sortAscending,
        dateFrom,
        dateTo,
        latitude,
        longitude,
        priceFrom,
        priceTo,
        type,
        willcard,
        id,
      } = params;

      const filters: FilterQuery<Vehicles> = { isActive: true, status: VehicleStatusEnum.AVAILABLE };
      if (id) filters._id = id;
      if (type) filters.type = type;
      if (priceFrom && priceTo) filters.pricexhour = { $gte: Number(priceFrom), $lte: Number(priceTo) };
      if (willcard) {
        filters.$or = [{ name: { $regex: willcard, $options: 'i' } }, { description: { $regex: willcard, $options: 'i' } }];
      }

      const _sortAscending = this.checkBooleanString.parseBoolean(sortAscending);

      const options: IPaginateOptions = {
        sortField,
        sortAscending: _sortAscending,
        limit,
        next,
        previous,
      };

      const projection = {
        isActive: 0,
        createdAt: 0,
        updatedAt: 0,
        __v: 0,
        // address: 0,
        documents: 0,
        description: 0,
        status: 0,
        type: 0,
        user: 0,
      };

      const data = await this.vehiclesService.findPaged(options, filters, projection);

      const result = { ...data };

      if (dateFrom && dateTo) {
        const dateStart = new Date(dateFrom);
        dateStart.setDate(dateStart.getDate() - 1);
        const dateEnd = new Date(dateTo);
        const vehicleIds = data.docs.map((item) => String(item._id));

        const reservas = await this.bookingService.find({
          'vehicle.id': { $in: vehicleIds },
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

        const vehicleConflicts = reservas.map((item) => String(item.vehicle.id));
        const aux = result.docs.filter((item) => !vehicleConflicts.includes(String(item._id)));
        result.docs = aux;
        result.totalDocs = aux.length;
      }

      if (latitude && longitude) {
        const aux = result.docs
          .map((item) => ({
            ...item.toJSON(),
            distance: this.getDistanceFromLatLonInMts(
              [Number(longitude), Number(latitude)],
              [item.address.location.lng, item.address.location.lat],
            ),
          }))
          .filter((item) => item.distance <= 100);

        result.docs = aux;
        result.totalDocs = aux.length;
      }

      return result;
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST, { cause: new Error(error) });
    }
  }

  async findVehicleById(id: string): Promise<Vehicles> {
    try {
      if (!id) throw new Error('Not found');
      return this.vehiclesService.findById(id).select('name description images pricexhour address details status');
    } catch (error) {
      throw new HttpException(error, HttpStatus.BAD_REQUEST);
    }
  }

  async getVehicles(params: GetVehiclesDto): Promise<IPaginateResult<Vehicles>> {
    try {
      const { next, previous, limit, sortField, sortAscending, user, vehicle } = params;

      const filters: FilterQuery<Vehicles> = { isActive: true };
      if (user) filters['user.id'] = user;
      if (vehicle) filters['vehicle.id'] = vehicle;
      const _sortAscending = this.checkBooleanString.parseBoolean(sortAscending);

      const options: IPaginateOptions = {
        sortField,
        sortAscending: _sortAscending,
        limit,
        next,
        previous,
      };

      const projection = {
        isActive: 0,
        createdAt: 0,
        updatedAt: 0,
        __v: 0,
      };

      return await this.vehiclesService.findPaged(options, filters, projection);
    } catch (error) {
      throw new HttpException(error, HttpStatus.BAD_REQUEST);
    }
  }

  async createVehicle(body: CreateVehicleDto): Promise<boolean> {
    try {
      await this.vehiclesService.create(body);
      return true;
    } catch (error) {
      throw new HttpException(error, HttpStatus.CONFLICT, { cause: new Error('Validation') });
    }
  }

  async updateVehicle(vehicle_id: string, body: UpdateVehicleDto): Promise<boolean> {
    try {
      await this.vehiclesService.findByIdAndUpdate(vehicle_id, { $set: body });
      return true;
    } catch (error) {
      throw new HttpException(error, HttpStatus.BAD_REQUEST);
    }
  }

  async deleteVehicle(vehicle_id: string): Promise<boolean> {
    try {
      await this.vehiclesService.findByIdAndUpdate(vehicle_id, { $set: { isActive: false } });
      return true;
    } catch (error) {
      throw new HttpException(error, HttpStatus.BAD_REQUEST);
    }
  }
}
