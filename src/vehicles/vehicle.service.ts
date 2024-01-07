import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { IPaginateOptions, IPaginateResult, PaginateModel } from 'typegoose-cursor-pagination';
import { CheckBooleanString } from '../utils/checkBooleanString';
import { ReturnModelType } from '@typegoose/typegoose';
import { InjectModel } from 'nestjs-typegoose';
import { Vehicles } from './models/vehicle.schema';
import { CreateVehicleDto } from './dto/createVehicle.dto';
import { UpdateVehicleDto } from './dto/updateVehicle.dto';
import { FilterQuery } from 'mongoose';
import { GetVehiclesDto } from './dto/getVehicles.dto';

@Injectable()
export class VehiclesService {
  constructor(
    @InjectModel(Vehicles)
    private readonly vehiclesService: ReturnModelType<typeof Vehicles> & PaginateModel<Vehicles, typeof Vehicles>,
    public readonly checkBooleanString: CheckBooleanString,
  ) {}

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
