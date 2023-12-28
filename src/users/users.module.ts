import { Module } from '@nestjs/common';
import { TypegooseModule } from 'nestjs-typegoose';
import { CheckBooleanString } from 'src/utils/checkBooleanString';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { Users } from './model/users.schema';

@Module({
  imports: [TypegooseModule.forFeature([Users])],
  controllers: [UsersController],
  providers: [UsersService, CheckBooleanString],
})
export class UsersModule {}
