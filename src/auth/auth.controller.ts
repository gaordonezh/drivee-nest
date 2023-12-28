import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CheckTokenDto, LoginAuthDto } from './dto/auth.dto';
import { Users } from 'src/users/model/users.schema';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post()
  loginUser(@Body() userObject: LoginAuthDto) {
    return this.authService.login(userObject);
  }

  @Post('token')
  checkToken(@Body() body: CheckTokenDto): Promise<Users> {
    return this.authService.check(body);
  }
}
