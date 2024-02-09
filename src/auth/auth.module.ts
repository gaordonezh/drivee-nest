import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TypegooseModule } from 'nestjs-typegoose';
import { JWT_SECRET_SEED } from 'src/utils/constants';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtStrategy } from './jwt.strategy';
import { Users } from 'src/users/model/users.schema';
import { SendMailModule } from 'src/helpers/sendmail/sendmail.module';

@Module({
  imports: [
    TypegooseModule.forFeature([Users]),
    JwtModule.register({ secret: JWT_SECRET_SEED, signOptions: { expiresIn: '30d' } }),
    SendMailModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
})
export class AuthModule {}
