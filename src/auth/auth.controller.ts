import { Body, Controller, Post, Headers } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginAuthDto, LoginGoogleAuthDto } from './dto/auth.dto';
import { Users } from 'src/users/model/users.schema';
import { JWT_SECRET_SEED } from 'src/utils/constants';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post()
  loginUser(@Body() userObject: LoginAuthDto): Promise<Users> {
    return this.authService.login(userObject);
  }

  @Post('google')
  loginGoogleUser(@Body() body: LoginGoogleAuthDto): Promise<Users> {
    if (body.secret !== JWT_SECRET_SEED) throw new Error('NOT_VALID_TOKEN');
    return this.authService.authGmailUser(body);
  }

  @Post('token')
  checkToken(@Headers('Authorization') token: string): Promise<Users> {
    return this.authService.check(token);
  }
}
