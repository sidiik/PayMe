import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserService } from 'src/user/user.service';
import { NewAccountDto } from './dto/account.dto';
import { reqPagination, resPagination } from 'src/DTOs/pagination.dto';

@Injectable()
export class AccountService {
  constructor(
    private prisma: PrismaService,
    private user: UserService,
  ) {}

  async createAccount(email: string) {
    const user = await this.user.findUser(email);

    if (!email) throw new BadRequestException('User does not exist.');

    const hasAccount = await this.findAccount(user.Phone.id);

    if (hasAccount)
      throw new BadRequestException('User has already an account.');

    const newAccount = await this.prisma.accountUSD.create({
      data: {
        accountNumber: user.Phone.number.padStart(12, '0'),
        balance: 0.0,
        Phone: {
          connect: {
            id: user.Phone.id,
          },
        },
      },
    });

    return newAccount;
  }

  async findAccount(phoneId: number) {
    const account = await this.prisma.accountUSD.findUnique({
      where: {
        phoneId,
      },
      include: {
        Phone: {
          select: {
            id: true,
            number: true,
            User: {
              select: {
                firstname: true,
                lastname: true,
                email: true,
              },
            },
          },
        },
      },
    });

    return account;
  }

  async listAccounts(pagination: reqPagination) {
    const skip = (pagination.page - 1) * pagination.size || 0;
    const totalCount = await this.prisma.accountUSD.count();
    const accounts = await this.prisma.accountUSD.findMany({
      skip,
      take: pagination.size,
      include: {
        Phone: {
          select: {
            id: true,
            number: true,
            User: {
              select: {
                firstname: true,
                lastname: true,
                email: true,
              },
            },
          },
        },
      },
    });
    return {
      accounts,
      page: pagination.page,
      size: pagination.size,
      totalPages: Math.ceil(totalCount / pagination.page),
      totalCount,
    };
  }
}
