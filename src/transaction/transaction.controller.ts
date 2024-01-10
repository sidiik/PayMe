import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import {
  Deposit,
  TransactionFilters,
  TransactionList,
  TransactionListDto,
  transferMoneyDto,
} from './dto/transaction.dto';
import { TransactionService } from './transaction.service';
import { reqPagination } from 'src/DTOs/pagination.dto';
import { Serialize } from 'src/interceptors/serialize.interceptor';
import { JwtGuard } from 'src/guards/jwt.guard';
import { GetUser } from 'src/user/decorators/user.decorator';
import { User } from '@prisma/client';
import { AdminGuard } from 'src/guards/admin.guard';
import { accTypeDto } from 'src/account/dto/account.dto';

@Controller('transaction')
export class TransactionController {
  constructor(private transactionService: TransactionService) {}

  @Serialize(TransactionList)
  @UseGuards(JwtGuard, new AdminGuard(['ADMIN', 'EDITOR']))
  @Post('deposit')
  deposit(@Body() data: Deposit) {
    return this.transactionService.deposit(data);
  }

  @UseGuards(JwtGuard, new AdminGuard(['ADMIN', 'EDITOR']))
  @Serialize(TransactionListDto)
  @Get('list')
  listTransactions(@Query() filters: TransactionFilters) {
    return this.transactionService.listTransactions(
      filters.pagination,
      filters,
    );
  }

  @Serialize(TransactionList)
  @UseGuards(JwtGuard)
  @Post('transfer')
  transferMoney(@Body() transferData: transferMoneyDto, @GetUser() user: User) {
    return this.transactionService.transferMoney(transferData, user.email);
  }
}
