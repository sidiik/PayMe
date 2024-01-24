import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUser, LoginUserDto } from 'src/user/user.dto';
import { UserService } from 'src/user/user.service';
import * as argon2 from 'argon2';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private jwt: JwtService,
    private userService: UserService,
  ) {}

  async register(user: CreateUser) {
    // * chech if email is taken

    const isEmailTaken = await this.userService.findUser(user.email);
    if (isEmailTaken) throw new ForbiddenException('Email is already in use');

    // * chech if phone is taken
    const isPhoneTaken = await this.userService.findUserByPhone(
      user.phoneNumber,
    );
    if (isPhoneTaken)
      throw new ForbiddenException('Phone number is already in use');

    // * create user

    const newUser = await this.userService.registerUser(user);
    return newUser;
  }

  async login(user: LoginUserDto) {
    const findUser = await this.userService.findUser(user.email);
    if (!findUser) throw new UnauthorizedException('Invalid credentials.');

    const isValidPassword = await argon2.verify(
      findUser.password,
      user.password,
    );
    if (!isValidPassword)
      throw new UnauthorizedException('Invalid credentials.');

    return {
      ...findUser,
      access_token: await this.genAccessToken(findUser.email),
      refresh_token: await this.genRefreshToken(findUser.email),
    };
  }

  async genAccessToken(email: string) {
    return this.jwt.sign(
      { email },
      {
        expiresIn: '15m',
      },
    );
  }

  async genRefreshToken(email: string) {
    return this.jwt.sign(
      { email },
      {
        expiresIn: '3d',
      },
    );
  }
}
