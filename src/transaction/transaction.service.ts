import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { AccountService } from 'src/account/account.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserService } from 'src/user/user.service';
import {
  Deposit,
  TransactionFilters,
  transferMoneyDto,
} from './dto/transaction.dto';
import { reqPagination } from 'src/DTOs/pagination.dto';
import { currencySymbol } from 'src/utils/currencySymbol';
import { Prisma, Roles, TransactionType } from '@prisma/client';

@Injectable()
export class TransactionService {
  constructor(
    private userService: UserService,
    private prisma: PrismaService,
    private accountService: AccountService,
  ) {}

  async deposit(data: Deposit) {
    const accType = await this.accountService.findAccountType(
      data.accType.accTypeSlug,
    );
    if (!accType)
      throw new BadRequestException(`${accType.account_slug} not supported.`);

    const phone = await this.userService.findUserByPhone(data.phoneNumber);
    if (!phone) throw new NotFoundException('User not found.');

    const account = await this.accountService.findAccount(
      phone.id,
      data.accType.accTypeSlug,
    );
    if (!account)
      throw new NotFoundException(
        `User does not have a ${data.accType.accTypeSlug} account.`,
      );

    await this.prisma.account.update({
      where: {
        id: account.id,
        accountType: {
          account_slug: data.accType.accTypeSlug,
        },
      },
      data: {
        balance: {
          increment: data.amount,
        },
      },
    });

    // TODO: Register transaction
    const newTransaction = await this.prisma.transactions.create({
      data: {
        amount: data.amount,
        sender_id: null,
        reciever_id: account.id,
        description: data.description,
        type: 'DEPOSITED',
        accTypeId: accType.id,
      },
    });

    // TODO: Send sms

    return newTransaction;
  }

  //   TODO: list transactions
  async listTransactions(
    pagination: reqPagination,
    filters: TransactionFilters,
  ) {
    try {
      const skip = (pagination.page - 1) * pagination.size || 0;
      const account = await this.accountService.findAccountType(
        filters.accTypeSlug,
      );

      if (!account)
        throw new BadRequestException(`${filters.accTypeSlug} not supported.`);

      if (
        !Object.values(TransactionType).includes(
          filters.type.toUpperCase() as TransactionType,
        )
      ) {
        throw new BadRequestException(
          `${filters.type} as transaction type is not supported.`,
        );
      }

      const transactionFilters: Prisma.TransactionsWhereInput = {
        type: (filters.type.toUpperCase() as TransactionType) || 'TRANSFER',
        accountType: {
          account_slug: filters.accTypeSlug,
        },
        OR: filters.phoneNumber && [
          {
            sender: {
              Phone: {
                number: filters.phoneNumber || null,
              },
            },
          },
          {
            reciever: {
              Phone: {
                number: filters.phoneNumber || null,
              },
            },
          },
        ],
        createdAt: filters.startDate &&
          filters.endDate && {
            lte: new Date(filters.endDate),
            gte: new Date(filters.startDate),
          },
      };

      const totalCount = await this.prisma.transactions.count({
        where: transactionFilters,
      });
      const transactions = await this.prisma.transactions.findMany({
        skip,
        take: pagination.size,
        include: {
          accountType: {
            select: {
              account_title: true,
              account_slug: true,
            },
          },
          reciever: {
            select: {
              Phone: {
                select: {
                  number: true,

                  User: {
                    select: {
                      firstname: true,
                      lastname: true,
                    },
                  },
                },
              },
            },
          },
          sender: {
            select: {
              Phone: {
                select: {
                  number: true,

                  User: {
                    select: {
                      firstname: true,
                      lastname: true,
                    },
                  },
                },
              },
            },
          },
        },
        where: transactionFilters,
      });

      return {
        transactions,
        page: pagination.page,
        size: pagination.size,
        totalPages: Math.ceil(totalCount / pagination.size),
        totalCount,
      };
    } catch (error) {
      throw new InternalServerErrorException(
        error.response ? error : 'Something went wrong.',
      );
    }
  }

  //   TODO: Send money to other account

  async transferMoney(transferData: transferMoneyDto, email: string) {
    try {
      const accType = await this.accountService.findAccountType(
        transferData.accType.accTypeSlug,
      );
      if (!accType)
        throw new BadRequestException(`${accType.account_slug} not supported.`);

      const currency = currencySymbol(transferData.accType.accTypeSlug);

      const senderUser = await this.userService.findUser(email);
      if (!senderUser) throw new NotFoundException('Sender user not found.');
      const senderAccount = await this.accountService.findAccount(
        senderUser.Phone.id,
        transferData.accType.accTypeSlug,
      );
      if (!senderAccount)
        throw new NotFoundException(
          `You don't have a ${transferData.accType.accTypeSlug} account to send money.`,
        );

      if (!(senderAccount.balance >= transferData.amount)) {
        throw new BadRequestException(
          `Insufficient balance, Your balance is ${currency}${senderAccount.balance.toFixed(
            2,
          )}`,
        );
      }

      const recieverUserPhone = await this.userService.findUserByPhone(
        transferData.phoneNumber,
      );

      if (!recieverUserPhone)
        throw new NotFoundException("Recipient account doesn't exist.");

      const recieverAccount = await this.accountService.findAccount(
        recieverUserPhone.id,
        transferData.accType.accTypeSlug,
      );

      if (!recieverAccount)
        throw new NotFoundException(
          `Recipient account doesn't have ${transferData.accType.accTypeSlug} account to receive money.`,
        );

      if (senderAccount.id === recieverAccount.id) {
        throw new BadRequestException(
          'Transfer failed: You cannot transfer money to your own account. Please select a different recipient.',
        );
      }

      if (
        currency === '$'
          ? parseFloat(transferData.amount.toFixed(2)) < 0.01
          : parseFloat(transferData.amount.toFixed(2)) < 300
      )
        throw new BadRequestException(
          `You can only transfer ${currency} ${
            currency === '$' ? 0.01 : 300
          } and above`,
        );

      // update the sender balance

      const sender = await this.prisma.account.update({
        where: {
          id: senderAccount.id,
          accountType: {
            account_slug: transferData.accType.accTypeSlug,
          },
        },
        data: {
          balance: {
            decrement: parseFloat(transferData.amount.toFixed(2)),
          },
        },
      });

      // update the rec balance

      await this.prisma.account.update({
        where: {
          id: recieverAccount.id,
          accountType: {
            account_slug: transferData.accType.accTypeSlug,
          },
        },
        data: {
          balance: {
            increment: parseFloat(transferData.amount.toFixed(2)),
          },
        },
      });

      // create transaction

      const newTransaction = await this.prisma.transactions.create({
        data: {
          amount: parseFloat(transferData.amount.toFixed(2)),
          description: `[--PAYME MONEY TRANSFER--]  ${
            senderAccount.fullname
          } (${senderAccount.Phone.number}) has sent ${currency}${parseFloat(
            transferData.amount.toFixed(2),
          )} to ${recieverAccount.fullname} (${
            recieverAccount.Phone.number
          }), Your current balance is ${currency}${sender.balance.toFixed(2)}`,
          type: 'TRANSFER',
          reciever_id: recieverAccount.id,
          sender_id: senderAccount.id,
          accTypeId: accType.id,
        },
      });

      return newTransaction;
    } catch (error) {
      throw new BadRequestException(error);
    }
  }
}
