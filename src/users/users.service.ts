import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { IPaginateOptions, IPaginateResult, PaginateModel } from 'typegoose-cursor-pagination';
import { CheckBooleanString } from '../utils/checkBooleanString';
import { ReturnModelType } from '@typegoose/typegoose';
import { InjectModel } from 'nestjs-typegoose';
import { compare, hash } from 'bcrypt';
import { Users } from './model/users.schema';
import { UserFiltersDto } from './dto/listUser.dto';
import { CreatePasswordDto, CreateUserDto, ForgotPasswordDto } from './dto/createUser.dto';
import { UpdateUserDto, UpdateUserPasswordDto } from './dto/updateUser.dto';
import { ValidateUserDataDto, ValidateUserDataResponseDto } from './dto/validateUserData.dto';
import { JwtService } from '@nestjs/jwt';
import { SendMailService } from 'src/helpers/sendmail/sendmail.service';
import { TemplateNamesEnum } from 'src/helpers/sendmail/template.enum';
import { FilterQuery } from 'mongoose';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(Users)
    private readonly usersModel: ReturnModelType<typeof Users> & PaginateModel<Users, typeof Users>,
    public readonly checkBooleanString: CheckBooleanString,
    private readonly jwtAuthService: JwtService,
    private readonly sendMailService: SendMailService,
  ) {}

  async getUsers(params: UserFiltersDto): Promise<IPaginateResult<Users>> {
    try {
      const { next, previous, limit, sortField, sortAscending, willcard, user, isActive, roles } = params;

      const filters: FilterQuery<Users> = {};

      if (willcard) {
        filters.$or = [
          { f_name: { $regex: willcard, $options: 'i' } },
          { l_name: { $regex: willcard, $options: 'i' } },
          { n_doc: { $regex: willcard, $options: 'i' } },
          { email: { $regex: willcard, $options: 'i' } },
        ];
      }

      if (roles) {
        filters.roles = { $in: roles };
      }

      if (user) filters._id = user;
      if (isActive) filters.isActive = isActive;

      const _sortAscending = this.checkBooleanString.parseBoolean(sortAscending);

      const options: IPaginateOptions = {
        sortField,
        sortAscending: _sortAscending,
        limit,
        next,
        previous,
      };

      const projection = {
        password: 0,
        isActive: 0,
        createdAt: 0,
        updatedAt: 0,
        __v: 0,
      };

      return await this.usersModel.findPaged(options, filters, projection);
    } catch (error) {
      throw new HttpException(error, HttpStatus.BAD_REQUEST, { cause: new Error('Validation') });
    }
  }

  async validateUserData(params: ValidateUserDataDto): Promise<ValidateUserDataResponseDto> {
    try {
      const validation: ValidateUserDataResponseDto = {};
      const { email, n_doc, phone, user } = params;

      if (email) {
        const query: FilterQuery<Users> = { email };
        if (user) query._id = { $ne: user };
        const counter = await this.usersModel.countDocuments(query);
        validation.email = counter > 0;
      }
      if (n_doc) {
        const query: FilterQuery<Users> = { n_doc };
        if (user) query._id = { $ne: user };
        const counter = await this.usersModel.countDocuments(query);
        validation.n_doc = counter > 0;
      }
      if (phone) {
        const query: FilterQuery<Users> = { phone };
        if (user) query._id = { $ne: user };
        const counter = await this.usersModel.countDocuments(query);
        validation.phone = counter > 0;
      }

      return validation;
    } catch (error) {
      throw new HttpException(error, HttpStatus.BAD_REQUEST, {
        cause: new Error('User fields validation'),
      });
    }
  }

  async createUser(body: CreateUserDto): Promise<boolean> {
    try {
      const res = (await this.usersModel.create(body)).toJSON();
      const token = this.jwtAuthService.sign({ payload: res._id });
      this.sendMailService.sendEmailWithTemplate({
        email: [body.email],
        fields: { token, name: res.f_name, email: res.email },
        subject: 'Bienvenido a Drivee',
        template: TemplateNamesEnum.CREATE_PASSWORD,
      });
      return true;
    } catch (error) {
      throw new HttpException(error, HttpStatus.CONFLICT, { cause: new Error('Validation') });
    }
  }

  async createPassword({ token, password, action }: CreatePasswordDto): Promise<string> {
    try {
      const { payload: user_id } = await this.jwtAuthService.verify(token);

      const findUser = (await this.usersModel.findById(user_id)).toJSON();
      if (findUser?.password && action !== 'FORGOT') {
        throw new HttpException('TOKEN_EXPIRED', HttpStatus.BAD_REQUEST, { cause: new Error('Token expired') });
      }

      const plainToHash = await hash(password, 10);
      await this.usersModel.findByIdAndUpdate(user_id, { password: plainToHash, isVerified: true });

      return token;
    } catch (error) {
      throw new HttpException(error, HttpStatus.BAD_REQUEST, { cause: new Error('TOKEN EXPIRED') });
    }
  }

  async forgotPassword({ email }: ForgotPasswordDto): Promise<boolean> {
    try {
      const res = await this.usersModel.findOne({ email });
      if (!res) throw new HttpException('NOT_FOUND', HttpStatus.BAD_REQUEST, { cause: new Error('NOT_FOUND') });

      const token = this.jwtAuthService.sign({ payload: res._id });
      this.sendMailService.sendEmailWithTemplate({
        email: [email],
        fields: { token, name: res.f_name, email: res.email, action: 'FORGOT' },
        subject: 'Recuperación de contraseña',
        template: TemplateNamesEnum.CREATE_PASSWORD,
      });
      return true;
    } catch (error) {
      throw new HttpException(error, HttpStatus.BAD_REQUEST, { cause: new Error('Validation') });
    }
  }

  async updateUser(user_id: string, body: UpdateUserDto): Promise<boolean> {
    try {
      await this.usersModel.findByIdAndUpdate(user_id, { $set: body });
      return true;
    } catch (error) {
      throw new HttpException(error, HttpStatus.BAD_REQUEST);
    }
  }

  async updateUserPassword(user_id: string, body: UpdateUserPasswordDto): Promise<boolean> {
    try {
      const findUser = (await this.usersModel.findById(user_id)).toJSON();
      if (!findUser) throw new HttpException('USER NOT FOUND', HttpStatus.BAD_REQUEST, { cause: new Error('NOT FOUND') });

      const checkPassword = await compare(body.current, findUser.password);
      if (!checkPassword) throw new HttpException('ERROR', 403);

      const plainToHash = await hash(body.new, 10);
      await this.usersModel.findByIdAndUpdate(user_id, { password: plainToHash });

      return true;
    } catch (error) {
      throw new HttpException(error, HttpStatus.BAD_REQUEST);
    }
  }

  async deleteUser(user_id: string): Promise<boolean> {
    try {
      await this.usersModel.findByIdAndUpdate(user_id, { isActive: false });
      return true;
    } catch (error) {
      throw new HttpException(error, HttpStatus.BAD_REQUEST);
    }
  }
}
