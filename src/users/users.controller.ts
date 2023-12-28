import {
  Controller,
  Post,
  Body,
  Delete,
  HttpCode,
  Param,
  Put,
  Query,
  Get,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { UserFiltersDto, UserResponseDto } from './dto/listUser.dto';
import { CreateUserDto } from './dto/createUser.dto';
import { UpdateParamUserDto, UpdateUserDto } from './dto/updateUser.dto';
import { DeleteParamUserDto } from './dto/deleteUser.dto';

/* @UseGuards(JwtAuthGuard) */
@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get()
  listUsers(@Query() filters: UserFiltersDto): Promise<UserResponseDto> {
    return this.usersService.getUsers(filters);
  }

  @HttpCode(202)
  @Post()
  createUser(@Body() body: CreateUserDto): Promise<boolean> {
    return this.usersService.createUser(body);
  }

  @Put(':user')
  updateOne(@Param() params: UpdateParamUserDto, @Body() body: UpdateUserDto): Promise<boolean> {
    return this.usersService.updateUser(params, body);
  }

  @Delete(':user')
  deleteOne(@Param() params: DeleteParamUserDto): Promise<boolean> {
    return this.usersService.deleteUser(params);
  }
}
