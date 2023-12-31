import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from 'nestjs-typegoose';
import { ReturnModelType } from '@typegoose/typegoose';
import { HttpException } from '@nestjs/common/exceptions';
import { compare, hash } from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { LoginAuthDto, LoginGoogleAuthDto } from './dto/auth.dto';
import { Users } from 'src/users/model/users.schema';
import { generatePassword } from 'src/utils/functions';
import { SendMailService } from 'src/helpers/sendmail/sendmail.service';
import { TemplateNamesEnum } from 'src/helpers/sendmail/template.enum';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(Users)
    private readonly usersModel: ReturnModelType<typeof Users>,
    private jwtAuthService: JwtService,
    private readonly sendMailService: SendMailService,
  ) {}

  async login(userObject: LoginAuthDto): Promise<Users> {
    const { user, password, skipBcrypt } = userObject;

    const findUser = await this.usersModel
      .findOne({ email: user, isActive: true, isVerified: true })
      .select('f_name l_name email phone t_doc n_doc sex address roles password date_birth photo');

    if (!findUser?.password) throw new HttpException('USER_OR_PASSWORD_INCORRECT', 404);

    let checkPassword = false;
    if (skipBcrypt) checkPassword = password === findUser.password;
    else checkPassword = await compare(password, findUser.password);

    if (!checkPassword) throw new HttpException('USER_OR_PASSWORD_INCORRECT', 403);

    const token = this.jwtAuthService.sign({ payload: findUser._id });
    const cloneObject = { ...findUser.toJSON() };
    delete cloneObject.password;
    const data = { ...cloneObject, token };

    return data;
  }

  async authGmailUser(body: LoginGoogleAuthDto): Promise<Users> {
    try {
      const findUser = await this.usersModel.findOne({ email: body.email });
      if (findUser) {
        const result = await this.login({
          user: findUser.email,
          password: findUser.password,
          skipBcrypt: true,
        });

        return result;
      }

      const plainPassword = generatePassword();
      const plainToHash = await hash(plainPassword, 10);

      const newUser = {
        email: body.email,
        photo: body.photo,
        f_name: body.f_name,
        l_name: body.l_name,
        roles: body.roles,
        password: plainToHash,
        isVerified: true,
      };

      const res = (await this.usersModel.create(newUser)).toJSON();
      if (!res) throw new HttpException('USER_EXISTS', HttpStatus.CONFLICT);

      this.sendMailService.sendEmailWithTemplate({
        email: [body.email],
        fields: { name: res.f_name, plainPassword, email: res.email, provider: body.provider },
        subject: 'Bienvenido a Drivee - Creación de cuenta',
        template: TemplateNamesEnum.SEND_PASSWORD_CREATED,
      });

      const result = await this.login({ user: res.email, password: plainPassword });
      return result;
    } catch (error) {
      throw new HttpException(error, HttpStatus.CONFLICT, { cause: new Error('Validation') });
    }
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
