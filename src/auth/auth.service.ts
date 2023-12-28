import { Injectable } from '@nestjs/common';
import { InjectModel } from 'nestjs-typegoose';
import { ReturnModelType } from '@typegoose/typegoose';
import { HttpException } from '@nestjs/common/exceptions';
import { compare } from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { CheckTokenDto, LoginAuthDto } from './dto/auth.dto';
import { Users } from 'src/users/model/users.schema';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(Users)
    private readonly usersModel: ReturnModelType<typeof Users>,
    private jwtAuthService: JwtService,
  ) {}

  async login(userObject: LoginAuthDto) {
    const { user, password } = userObject;

    const findUser = await this.usersModel.findOne({ n_doc: user, isActive: true });
    if (!findUser) throw new HttpException('USER_OR_PASSWORD_INCORRECT', 404);

    const checkPassword = await compare(password, findUser.password);
    if (!checkPassword) throw new HttpException('USER_OR_PASSWORD_INCORRECT', 403);

    const token = await this.jwtAuthService.sign({ payload: findUser._id });
    const data = { user: findUser, token };

    return data;
  }

  async check({ token }: CheckTokenDto): Promise<Users> {
    try {
      const { payload } = await this.jwtAuthService.verify(token);
      const findUser = await this.usersModel
        .findOne({ _id: payload, isActive: true })
        .select(
          'f_name l_name t_doc n_doc email address phone photo sex roles date_birth headquarters companies',
        );

      if (!findUser) throw new HttpException('USER_DISABLED', 403);

      return findUser;
    } catch (error) {
      throw new HttpException('TOKEN_EXPIRED', 403);
    }
  }
}
