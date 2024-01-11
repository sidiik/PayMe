import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { Cache } from 'cache-manager';
import { AccountService } from 'src/account/account.service';
import { getRateDto, setRateDto } from './rate.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class RateService {
  constructor(
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private accountService: AccountService,
    private prismaService: PrismaService,
  ) {}

  async setRate(rateData: setRateDto) {
    const fromAccType = await this.accountService.findAccountType(
      rateData.fromAccType.accTypeSlug,
    );
    if (!fromAccType)
      throw new BadRequestException(
        `${rateData.fromAccType.accTypeSlug} not supported.`,
      );

    const toAccType = await this.accountService.findAccountType(
      rateData.toAccType.accTypeSlug,
    );
    if (!toAccType)
      throw new BadRequestException(
        `${rateData.toAccType.accTypeSlug} not supported.`,
      );

    let exchange: any;

    const existingExchange = await this.findTodayExchange({
      fromAccType: rateData.fromAccType,
      toAccType: rateData.toAccType,
    });

    if (existingExchange) {
      exchange = await this.prismaService.exchange.update({
        where: {
          id: existingExchange.id,
        },
        data: {
          amount: parseFloat(rateData.amount),
        },
        include: {
          fromAccountType: true,
          toAccountType: true,
        },
      });

      return exchange;
    }

    exchange = await this.prismaService.exchange.create({
      data: {
        fromAccountType: {
          connect: {
            account_slug: rateData.fromAccType.accTypeSlug,
          },
        },
        toAccountType: {
          connect: {
            account_slug: rateData.toAccType.accTypeSlug,
          },
        },
        amount: parseFloat(rateData.amount),
      },
      include: {
        fromAccountType: true,
        toAccountType: true,
      },
    });

    return exchange;
  }

  async findTodayExchange(rateData: getRateDto) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const exchange = await this.prismaService.exchange.findFirst({
      where: {
        createdAt: {
          gte: today,
        },
        fromAccountType: {
          account_slug: rateData.fromAccType.accTypeSlug,
        },
        toAccountType: {
          account_slug: rateData.toAccType.accTypeSlug,
        },
      },
      include: {
        fromAccountType: true,
        toAccountType: true,
      },
    });

    return exchange;
  }

  async delRate(rateData: getRateDto) {
    const fromAccType = await this.accountService.findAccountType(
      rateData.fromAccType.accTypeSlug,
    );
    if (!fromAccType)
      throw new BadRequestException(
        `${rateData.fromAccType.accTypeSlug} not supported.`,
      );

    const toAccType = await this.accountService.findAccountType(
      rateData.toAccType.accTypeSlug,
    );
    if (!toAccType)
      throw new BadRequestException(
        `${rateData.toAccType.accTypeSlug} not supported.`,
      );

    await this.cacheManager.del(
      `rate-${fromAccType.account_slug}-${toAccType.account_slug}`,
    );
    return {
      isSuccess: true,
      message: `Deleted rate-${fromAccType.account_slug}-${toAccType.account_slug}`,
    };
  }

  async getRate(rateData: getRateDto) {
    const fromAccType = await this.accountService.findAccountType(
      rateData.fromAccType.accTypeSlug,
    );
    if (!fromAccType)
      throw new BadRequestException(
        `${rateData.fromAccType.accTypeSlug} not supported.`,
      );

    const toAccType = await this.accountService.findAccountType(
      rateData.toAccType.accTypeSlug,
    );
    if (!toAccType)
      throw new BadRequestException(
        `${rateData.toAccType.accTypeSlug} not supported.`,
      );

    const exchange = await this.findTodayExchange(rateData);

    if (!exchange)
      throw new BadRequestException(
        'No rate found, Please contact support team.',
      );

    return exchange;
  }
}
