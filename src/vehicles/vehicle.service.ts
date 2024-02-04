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

@Injectable()
export class VehiclesService {
  constructor(
    @InjectModel(Vehicles)
    private readonly vehiclesService: ReturnModelType<typeof Vehicles> & PaginateModel<Vehicles, typeof Vehicles>,
    public readonly checkBooleanString: CheckBooleanString,
  ) {}

  async getPublicVehicles(params: GetPublicVehiclesDto): Promise<IPaginateResult<Vehicles>> {
    try {
      const {
        next,
        previous,
        limit,
        sortField,
        sortAscending,
        // dateFrom,
        // dateTo,
        // latitude,
        // longitude,
        priceFrom,
        priceTo,
        type,
        willcard,
      } = params;

      const filters: FilterQuery<Vehicles> = { isActive: true };
      if (type) filters.type = type;
      // if (dateFrom && dateTo) {
      // }
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
        address: 0,
        documents: 0,
        description: 0,
        status: 0,
        type: 0,
        user: 0,
      };

      return this.vehiclesService.findPaged(options, filters, projection);
    } catch (error) {
      throw new HttpException(error, HttpStatus.BAD_REQUEST);
    }
  }

  async findVehicleById(id: string): Promise<Vehicles> {
    try {
      if (!id) throw new Error('Not found');
      return this.vehiclesService.findById(id).select('name description images pricexhour address details');
    } catch (error) {
      throw new HttpException(error, HttpStatus.BAD_REQUEST);
    }
  }

  async getVehicles(params: GetVehiclesDto): Promise<IPaginateResult<Vehicles>> {
    try {
      const { next, previous, limit, sortField, sortAscending, user } = params;

      const filters: FilterQuery<Vehicles> = { isActive: true, 'user.id': user };
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
