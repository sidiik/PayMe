import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import * as argon2 from 'argon2';
import { AuthService } from 'src/auth/auth.service';
import { UserService } from 'src/user/user.service';
import { Roles } from '@prisma/client';

@Injectable()
export class SeedService {
  constructor(
    private prisma: PrismaService,
    private userService: UserService,
  ) {}

  async seedUsers() {
    const totalUsers = await this.prisma.user.count();
    if (totalUsers) throw new BadRequestException(`Found ${totalUsers} saved.`);

    const users = [
      {
        email: 'sidiikpro@gmail.com',
        role: 'ADMIN',
        password: 'password123',
        firstname: 'Sidiiq',
        lastname: 'Cumar',
        phoneNumber: '634444444',
      },
      {
        email: 'mohamed@gmail.com',
        role: 'EDITOR',
        password: 'password123',
        firstname: 'Mohamed',
        lastname: 'Omar',
        phoneNumber: '634444445',
      },
    ];

    for (const userData of users) {
      const hashedPassword = await argon2.hash(userData.password);
      const { phoneNumber, password, ...rest } = userData;
      await this.prisma.user.create({
        data: {
          email: userData.email,
          firstname: userData.firstname,
          lastname: userData.lastname,
          password: hashedPassword,
          role: userData.role as Roles,
          Phone: {
            create: {
              number: userData.phoneNumber,
            },
          },
        },
      });
    }
    return {
      message: 'Users seeded✅✅',
    };
  }

  async seedAccountTypes() {
    const accTypes = await this.prisma.accountTypes.count();

    if (accTypes)
      throw new BadRequestException(`Found ${accTypes} account types saved.`);

    const accountTypes = [
      {
        account_title: 'Dollar Account',
        account_slug: 'usd',
      },
      {
        account_title: 'Somaliland Shilling Account',
        account_slug: 'slsh',
      },
    ];

    const createAccTypes = await this.prisma.accountTypes.createMany({
      data: accountTypes,
    });

    return {
      isSuccess: true,
      accountTypes: createAccTypes,
    };
  }
}
