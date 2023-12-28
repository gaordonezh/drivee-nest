import { Body, Controller, Post, Headers } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginAuthDto } from './dto/auth.dto';
import { Users } from 'src/users/model/users.schema';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post()
  loginUser(@Body() userObject: LoginAuthDto) {
    return this.authService.login(userObject);
  }

  @Post('token')
  checkToken(@Headers('Authorization') token: string): Promise<Users> {
    return this.authService.check(token);
  }
}
