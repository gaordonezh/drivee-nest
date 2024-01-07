import { Controller, Post, Body, Delete, Param, Put, Query, Get, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { IPaginateResult } from 'typegoose-cursor-pagination';
import { VehiclesService } from './vehicle.service';
import { Vehicles } from './models/vehicle.schema';
import { CreateVehicleDto } from './dto/createVehicle.dto';
import { UpdateVehicleDto } from './dto/updateVehicle.dto';
import { GetVehiclesDto } from './dto/getVehicles.dto';

@UseGuards(JwtAuthGuard)
@Controller('vehicles')
export class VehiclesController {
  constructor(private vehiclesService: VehiclesService) {}

  @Get()
  listVehicles(@Query() filters: GetVehiclesDto): Promise<IPaginateResult<Vehicles>> {
    return this.vehiclesService.getVehicles(filters);
  }

  @Post()
  createVehicle(@Body() body: CreateVehicleDto): Promise<boolean> {
    return this.vehiclesService.createVehicle(body);
  }

  @Put(':vehicle')
  updateOne(@Param('vehicle') vehicle_id: string, @Body() body: UpdateVehicleDto): Promise<boolean> {
    return this.vehiclesService.updateVehicle(vehicle_id, body);
  }

  @Delete(':vehicle')
  deleteOne(@Param('vehicle') vehicle_id: string): Promise<boolean> {
    return this.vehiclesService.deleteVehicle(vehicle_id);
  }
}
