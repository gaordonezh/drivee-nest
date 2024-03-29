import { Module } from '@nestjs/common';
import { TypegooseModule } from 'nestjs-typegoose';
import { Documents } from './documents.schema';
import { DocumentsController } from './documents.controller';
import { DocumentsService } from './documents.service';
import { CheckBooleanString } from 'src/utils/checkBooleanString';
import { Users } from 'src/users/model/users.schema';
import { SendMailModule } from 'src/helpers/sendmail/sendmail.module';
import { Vehicles } from 'src/vehicles/models/vehicle.schema';

@Module({
  imports: [TypegooseModule.forFeature([Documents, Users, Vehicles]), SendMailModule],
  controllers: [DocumentsController],
  providers: [DocumentsService, CheckBooleanString],
})
export class DocumentsModule {}
