import {
  BadRequestException,
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  Put,
  Res,
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
import { JwtGuard, RefreshGuard } from 'src/guards/jwt.guard';
import { GetUser } from './decorators/user.decorator';
import { User } from '@prisma/client';
import { VerifyGuard } from 'src/guards/verify.guard';
import { UserService } from './user.service';
import { AdminGuard } from 'src/guards/admin.guard';
import { Response } from 'express';

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
  async login(
    @Body() user: LoginUserDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { access_token, refresh_token, ...rest } =
      await this.authService.login(user);

    res.cookie('access_token', access_token, {
      httpOnly: true,
      expires: new Date(Date.now() + 3600 * 1000),
    });

    res.cookie('refresh_token', refresh_token, {
      httpOnly: true,
      expires: new Date(Date.now() + 3600 * 24 * 3 * 1000),
    });

    return rest;
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

  @UseGuards(RefreshGuard)
  @Get('refresh')
  async refreshToken(
    @GetUser() user: User,
    @Res({ passthrough: true }) res: Response,
  ) {
    const accessToken = await this.authService.genAccessToken(user.email);
    res.cookie('access_token', accessToken, {
      expires: new Date(Date.now() + 3600 * 1000),
    });

    return {
      isSuccess: true,
    };
  }
}
