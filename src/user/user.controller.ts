import { Body, Controller, Get, HttpCode, Post } from '@nestjs/common';
import { CreateUser, LoginUserDto, UserDto, loginDto } from './user.dto';
import { AuthService } from 'src/auth/auth.service';
import { Serialize } from 'src/interceptors/serialize.interceptor';

@Controller('user')
export class UserController {
  constructor(private authService: AuthService) {}
  @Serialize(UserDto)
  @Post('new')
  create(@Body() user: CreateUser) {
    return this.authService.register(user);
  }

  @Serialize(loginDto)
  @HttpCode(200)
  @Post('login')
  login(@Body() user: LoginUserDto) {
    return this.authService.login(user);
  }
}
