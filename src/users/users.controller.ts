import { Controller, Post, Body, Delete, Param, Put, Query, Get, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { UserFiltersDto } from './dto/listUser.dto';
import { CreatePasswordDto, CreateUserDto, ForgotPasswordDto } from './dto/createUser.dto';
import { UpdateUserDto, UpdateUserPasswordDto } from './dto/updateUser.dto';
import { IPaginateResult } from 'typegoose-cursor-pagination';
import { Users } from './model/users.schema';
import { ValidateUserDataDto, ValidateUserDataResponseDto } from './dto/validateUserData.dto';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  listUsers(@Query() filters: UserFiltersDto): Promise<IPaginateResult<Users>> {
    return this.usersService.getUsers(filters);
  }

  @Post()
  createUser(@Body() body: CreateUserDto): Promise<boolean> {
    return this.usersService.createUser(body);
  }

  @Post('validate')
  validate(@Body() body: ValidateUserDataDto): Promise<ValidateUserDataResponseDto> {
    return this.usersService.validateUserData(body);
  }

  @Post('create-password')
  createPassword(@Body() body: CreatePasswordDto): Promise<string> {
    return this.usersService.createPassword(body);
  }

  @Post('forgot-password')
  forgotPassword(@Body() body: ForgotPasswordDto): Promise<boolean> {
    return this.usersService.forgotPassword(body);
  }

  @UseGuards(JwtAuthGuard)
  @Put(':user')
  updateOne(@Param('user') user_id: string, @Body() body: UpdateUserDto): Promise<boolean> {
    return this.usersService.updateUser(user_id, body);
  }

  @UseGuards(JwtAuthGuard)
  @Put('update-password/:user')
  updatePassword(@Param('user') user_id: string, @Body() body: UpdateUserPasswordDto): Promise<boolean> {
    return this.usersService.updateUserPassword(user_id, body);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':user')
  deleteOne(@Param('user') user_id: string): Promise<boolean> {
    return this.usersService.deleteUser(user_id);
  }
}
