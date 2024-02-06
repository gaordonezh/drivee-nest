import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { IPaginateOptions, IPaginateResult, PaginateModel } from 'typegoose-cursor-pagination';
import { CheckBooleanString } from '../utils/checkBooleanString';
import { ReturnModelType } from '@typegoose/typegoose';
import { InjectModel } from 'nestjs-typegoose';
import { FilterQuery } from 'mongoose';
import { Comments } from './models/comments.schema';
import { GetCommentsDto } from './dto/getComments.dto';
import { CreateCommentDto } from './dto/createComment.dto';

@Injectable()
export class CommentsService {
  constructor(
    @InjectModel(Comments)
    private readonly commentsService: ReturnModelType<typeof Comments> & PaginateModel<Comments, typeof Comments>,
    public readonly checkBooleanString: CheckBooleanString,
  ) {}

  async getComments(params: GetCommentsDto): Promise<IPaginateResult<Comments>> {
    try {
      const { next, previous, limit, sortField, sortAscending, vehicle, user } = params;

      const filters: FilterQuery<Comments> = { isActive: true };
      if (user) filters['user.id'] = user;
      if (vehicle) filters['vehicle.id'] = vehicle;
      const _sortAscending = this.checkBooleanString.parseBoolean(sortAscending);

      const options: IPaginateOptions = {
        sortField,
        sortAscending: _sortAscending,
        limit,
        next,
        previous,
      };

      const projection = {
        isActive: 0,
        createdAt: 0,
        vehicle: 0,
        __v: 0,
      };

      return this.commentsService.findPaged(options, filters, projection);
    } catch (error) {
      throw new HttpException(error, HttpStatus.BAD_REQUEST);
    }
  }

  async createComment(body: CreateCommentDto): Promise<boolean> {
    try {
      await this.commentsService.create(body);
      return true;
    } catch (error) {
      throw new HttpException(error, HttpStatus.CONFLICT, { cause: new Error('Validation') });
    }
  }
}
