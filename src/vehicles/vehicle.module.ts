import { Module } from '@nestjs/common';
import { TypegooseModule } from 'nestjs-typegoose';
import { CheckBooleanString } from 'src/utils/checkBooleanString';
import { Vehicles } from './models/vehicle.schema';
import { VehiclesController } from './vehicle.controller';
import { VehiclesService } from './vehicle.service';
import { Booking } from 'src/booking/booking.schema';

@Module({
  imports: [TypegooseModule.forFeature([Vehicles, Booking])],
  controllers: [VehiclesController],
  providers: [VehiclesService, CheckBooleanString],
})
export class VehiclesModule {}
