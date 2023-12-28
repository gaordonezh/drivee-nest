import { Module } from '@nestjs/common';
import { TypegooseModule } from 'nestjs-typegoose';
import { CheckBooleanString } from 'src/utils/checkBooleanString';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { Users } from './model/users.schema';
import { JwtModule } from '@nestjs/jwt';
import { JWT_SECRET_SEED } from 'src/utils/constants';

@Module({
  imports: [
    TypegooseModule.forFeature([Users]),
    JwtModule.register({ secret: JWT_SECRET_SEED, signOptions: { expiresIn: '1d' } }),
  ],
  controllers: [UsersController],
  providers: [UsersService, CheckBooleanString],
})
export class UsersModule {}
