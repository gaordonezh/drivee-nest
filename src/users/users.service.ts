import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { IPaginateOptions, IPaginateResult, PaginateModel } from 'typegoose-cursor-pagination';
import { CheckBooleanString } from '../utils/checkBooleanString';
import { ReturnModelType } from '@typegoose/typegoose';
import { InjectModel } from 'nestjs-typegoose';
import { hash } from 'bcrypt';
import { Users } from './model/users.schema';
import { UserFiltersDto } from './dto/listUser.dto';
import { CreateUserDto } from './dto/createUser.dto';
import { UpdateParamUserDto, UpdateUserDto } from './dto/updateUser.dto';
import { DeleteParamUserDto } from './dto/deleteUser.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(Users)
    private readonly usersModel: ReturnModelType<typeof Users> & PaginateModel<Users, typeof Users>,
    public readonly checkBooleanString: CheckBooleanString,
  ) {}

  async getUsers(params: UserFiltersDto): Promise<IPaginateResult<Users>> {
    const { next, previous, limit, sortField, sortAscending, willcard, user, isActive, roles } =
      params;

    const filters: Record<string, unknown> = { roles: { $in: roles } };

    if (willcard) {
      filters.$or = [
        { f_name: { $regex: willcard, $options: 'i' } },
        { l_name: { $regex: willcard, $options: 'i' } },
        { n_doc: { $regex: willcard, $options: 'i' } },
        { email: { $regex: willcard, $options: 'i' } },
      ];
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
      headquarters: 0,
      companies: 0,
      isActive: 0,
      __v: 0,
    };

    return await this.usersModel.findPaged(options, filters, projection);
  }

  async createUser(body: CreateUserDto): Promise<boolean> {
    try {
      const password = 'password';
      const plainToHash = await hash(password, 10);
      const readyBody = { ...body, password: plainToHash };
      await this.usersModel.create(readyBody);

      return true;
    } catch (error) {
      throw new HttpException(error, HttpStatus.CONFLICT, { cause: new Error('Validation') });
    }
  }

  async updateUser(params: UpdateParamUserDto, body: UpdateUserDto): Promise<boolean> {
    try {
      await this.usersModel.findByIdAndUpdate(params.user, body);
      return true;
    } catch (error) {
      throw new HttpException(error, HttpStatus.CONFLICT);
    }
  }

  async deleteUser(params: DeleteParamUserDto): Promise<boolean> {
    try {
      await this.usersModel.findByIdAndUpdate(params.user, { isActive: false });
      return true;
    } catch (error) {
      throw new HttpException(error, HttpStatus.CONFLICT);
    }
  }
}
