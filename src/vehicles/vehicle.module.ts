import { Module } from '@nestjs/common';
import { TypegooseModule } from 'nestjs-typegoose';
import { CheckBooleanString } from 'src/utils/checkBooleanString';
import { Vehicles } from './models/vehicle.schema';
import { VehiclesController } from './vehicle.controller';
import { VehiclesService } from './vehicle.service';

@Module({
  imports: [TypegooseModule.forFeature([Vehicles])],
  controllers: [VehiclesController],
  providers: [VehiclesService, CheckBooleanString],
})
export class VehiclesModule {}
