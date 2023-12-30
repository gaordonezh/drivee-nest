import { Injectable } from '@nestjs/common';
import { InjectModel } from 'nestjs-typegoose';
import { ReturnModelType } from '@typegoose/typegoose';
import { HttpException } from '@nestjs/common/exceptions';
import { compare } from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { LoginAuthDto } from './dto/auth.dto';
import { Users } from 'src/users/model/users.schema';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(Users)
    private readonly usersModel: ReturnModelType<typeof Users>,
    private jwtAuthService: JwtService,
  ) {}

  async login(userObject: LoginAuthDto): Promise<Users> {
    const { user, password } = userObject;

    const findUser = await this.usersModel
      .findOne({ email: user, isActive: true, isVerified: true })
      .select('f_name l_name email phone t_doc n_doc sex address roles password date_birth photo');

    if (!findUser?.password) throw new HttpException('USER_OR_PASSWORD_INCORRECT', 404);

    const checkPassword = await compare(password, findUser.password);
    if (!checkPassword) throw new HttpException('USER_OR_PASSWORD_INCORRECT', 403);

    const token = this.jwtAuthService.sign({ payload: findUser._id });
    const cloneObject = { ...findUser.toJSON() };
    delete cloneObject.password;
    const data = { ...cloneObject, token };

    return data;
  }

  async check(token: string): Promise<Users> {
    try {
      const parsed = token.split(' ')[1];
      const { payload: user_id } = await this.jwtAuthService.verify(parsed);
      const findUser = await this.usersModel
        .findOne({ _id: user_id, isActive: true, isVerified: true })
        .select('f_name l_name email phone t_doc n_doc sex address roles date_birth photo');

      if (!findUser) throw new HttpException('USER_DISABLED', 403);

      return findUser;
    } catch (error) {
      throw new HttpException('TOKEN_EXPIRED', 403);
    }
  }
}
