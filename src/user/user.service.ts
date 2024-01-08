import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUser } from './user.dto';
import * as argon2 from 'argon2';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  //    TODO: Register new user
  async registerUser(user: CreateUser) {
    const hashedPassword = await argon2.hash(user.password);

    const newUser = await this.prisma.user.create({
      data: {
        email: user.email,
        firstname: user.firstname,
        lastname: user.lastname,
        password: hashedPassword,
        Phone: {
          create: {
            number: user.phoneNumber,
          },
        },
      },
    });

    return newUser;
  }

  //   TODO: find by email

  async findUser(email: string) {
    const user = await this.prisma.user.findUnique({
      where: {
        email,
      },
      include: {
        Phone: true,
      },
    });

    return user;
  }

  //   TODO: find by phone number

  async findUserByPhone(phone: string) {
    const user = await this.prisma.phone.findUnique({
      where: {
        number: phone,
      },
      include: {
        User: true,
      },
    });

    return user;
  }

  //   TODO: update user
  async updateUser() {}

  //   TODO: Change password

  //   TODO: forget password
}
