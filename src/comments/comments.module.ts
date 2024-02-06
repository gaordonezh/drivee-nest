import { Module } from '@nestjs/common';
import { TypegooseModule } from 'nestjs-typegoose';
import { CheckBooleanString } from 'src/utils/checkBooleanString';
import { Users } from 'src/users/model/users.schema';
import { SendMailModule } from 'src/helpers/sendmail/sendmail.module';
import { Vehicles } from 'src/vehicles/models/vehicle.schema';
import { Comments } from './models/comments.schema';
import { CommentsController } from './comments.controller';
import { CommentsService } from './comments.service';

@Module({
  imports: [TypegooseModule.forFeature([Comments, Users, Vehicles]), SendMailModule],
  controllers: [CommentsController],
  providers: [CommentsService, CheckBooleanString],
})
export class CommentsModule {}
