import { Controller, Post, Body, UseGuards, Get, Query } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { IPaginateResult } from 'typegoose-cursor-pagination';
import { CommentsService } from './comments.service';
import { GetCommentsDto } from './dto/getComments.dto';
import { Comments } from './models/comments.schema';
import { CreateCommentDto } from './dto/createComment.dto';

@Controller('comments')
export class CommentsController {
  constructor(private commentsService: CommentsService) {}

  @Get()
  list(@Query() filters: GetCommentsDto): Promise<IPaginateResult<Comments>> {
    return this.commentsService.getComments(filters);
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() body: CreateCommentDto): Promise<boolean> {
    return this.commentsService.createComment(body);
  }
}
