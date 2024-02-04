import { Controller, Post, Body, Delete, Param, Put, Query, Get, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { IPaginateResult } from 'typegoose-cursor-pagination';
import { VehiclesService } from './vehicle.service';
import { Vehicles } from './models/vehicle.schema';
import { CreateVehicleDto } from './dto/createVehicle.dto';
import { UpdateVehicleDto } from './dto/updateVehicle.dto';
import { GetPublicVehiclesDto, GetVehiclesDto } from './dto/getVehicles.dto';

@Controller('vehicles')
export class VehiclesController {
  constructor(private vehiclesService: VehiclesService) {}

  @Get('list')
  listPublicVehicles(@Query() params: GetPublicVehiclesDto): Promise<IPaginateResult<Vehicles>> {
    return this.vehiclesService.getPublicVehicles(params);
  }

  @Get('list/:vehicle')
  findVehicleById(@Param('vehicle') vehicle_id: string): Promise<Vehicles> {
    return this.vehiclesService.findVehicleById(vehicle_id);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  listVehicles(@Query() filters: GetVehiclesDto): Promise<IPaginateResult<Vehicles>> {
    return this.vehiclesService.getVehicles(filters);
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  createVehicle(@Body() body: CreateVehicleDto): Promise<boolean> {
    return this.vehiclesService.createVehicle(body);
  }

  @UseGuards(JwtAuthGuard)
  @Put(':vehicle')
  updateOne(@Param('vehicle') vehicle_id: string, @Body() body: UpdateVehicleDto): Promise<boolean> {
    return this.vehiclesService.updateVehicle(vehicle_id, body);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':vehicle')
  deleteOne(@Param('vehicle') vehicle_id: string): Promise<boolean> {
    return this.vehiclesService.deleteVehicle(vehicle_id);
  }
}
