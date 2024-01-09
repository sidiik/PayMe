import {
  BadRequestException,
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import {
  CreateUser,
  LoginUserDto,
  UserDto,
  changeRoleDto,
  loginDto,
} from './user.dto';
import { AuthService } from 'src/auth/auth.service';
import { Serialize } from 'src/interceptors/serialize.interceptor';
import { JwtGuard } from 'src/guards/jwt.guard';
import { GetUser } from './decorators/user.decorator';
import { User } from '@prisma/client';
import { VerifyGuard } from 'src/guards/verify.guard';
import { UserService } from './user.service';
import { AdminGuard } from 'src/guards/admin.guard';

@Controller('user')
export class UserController {
  constructor(
    private authService: AuthService,
    private userService: UserService,
  ) {}
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

  @Serialize(UserDto)
  @UseGuards(JwtGuard)
  @Get('me')
  me(@GetUser() user: User) {
    return user;
  }

  @UseGuards(JwtGuard, VerifyGuard)
  @Put('verify')
  verify() {
    return 'Verified';
  }

  @Serialize(UserDto)
  @UseGuards(JwtGuard, new AdminGuard(['ADMIN']))
  @Put('change-role')
  changeRole(@Body() data: changeRoleDto, @GetUser() user: User) {
    if (data.email === user.email) {
      throw new BadRequestException('You are not allowed to change your role.');
    }
    return this.userService.changeRole(data.email, data.role, data.isVerified);
  }
}
