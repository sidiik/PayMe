import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserService } from 'src/user/user.service';
import { NewAccountDto } from './dto/account.dto';
import { reqPagination, resPagination } from 'src/DTOs/pagination.dto';
import { currencySymbol } from 'src/utils/currencySymbol';

@Injectable()
export class AccountService {
  constructor(
    private prisma: PrismaService,
    private user: UserService,
  ) {}

  // * Get my balance
  async myBalance(email: string, accTypeSlug: string) {
    const user = await this.user.findUser(email);

    if (!email) throw new BadRequestException('User does not exist.');

    const accType = await this.findAccountType(accTypeSlug);
    if (!accType)
      throw new BadRequestException(`${accTypeSlug} not supported.`);

    const account = await this.findAccount(user.Phone.id, accTypeSlug);

    if (!account)
      throw new BadRequestException(
        `You do not have an ${accType.account_slug} account.`,
      );

    return {
      balance: `${currencySymbol(accTypeSlug)}${account.balance.toFixed(2)}`,
    };
  }

  //  * Create new account
  async createAccount(email: string, newAccountData: NewAccountDto) {
    try {
      const user = await this.user.findUser(email);

      if (!email) throw new BadRequestException('User does not exist.');

      const accType = await this.findAccountType(newAccountData.accTypeSlug);
      if (!accType)
        throw new BadRequestException(
          `${newAccountData.accTypeSlug} not supported.`,
        );

      const checkAccount = await this.findAccount(
        user.Phone.id,
        newAccountData.accTypeSlug,
      );

      if (checkAccount)
        throw new BadRequestException(
          `${checkAccount.fullname} has already a ${newAccountData.accTypeSlug} account.`,
        );

      const newAccount = await this.prisma.account.create({
        data: {
          accountNumber: user.Phone.number.padStart(12, '0'),
          balance: 0.0,
          accountType: {
            connect: {
              account_slug: newAccountData.accTypeSlug,
            },
          },
          fullname: newAccountData.fullname,
          Phone: {
            connect: {
              id: user.Phone.id,
            },
          },
        },
      });

      return newAccount;
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  // * Find account type

  async findAccountType(accTypeSlug: string) {
    const accType = await this.prisma.accountTypes.findFirst({
      where: {
        account_slug: accTypeSlug,
      },
    });

    return accType;
  }

  //  * Find account
  async findAccount(phoneId: number, type: string) {
    const account = await this.prisma.account.findFirst({
      where: {
        phoneId,
        accountType: {
          account_slug: type,
        },
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

  // * List all accounts
  async listAccounts(pagination: reqPagination) {
    const skip = (pagination.page - 1) * pagination.size || 0;
    const totalCount = await this.prisma.account.count();
    const accounts = await this.prisma.account.findMany({
      skip,
      take: pagination.size,
      include: {
        accountType: {
          select: {
            account_title: true,
            account_slug: true,
          },
        },
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
