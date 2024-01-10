import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import {
  AccountDto,
  AccountListDto,
  NewAccountDto,
  accTypeDto,
} from './dto/account.dto';
import { AccountService } from './account.service';
import { JwtGuard } from 'src/guards/jwt.guard';
import { GetUser } from 'src/user/decorators/user.decorator';
import { User } from '@prisma/client';
import { UserService } from 'src/user/user.service';
import { AdminGuard } from 'src/guards/admin.guard';
import { Serialize } from 'src/interceptors/serialize.interceptor';
import { reqPagination, resPagination } from 'src/DTOs/pagination.dto';

@Controller('account')
export class AccountController {
  constructor(private accountService: AccountService) {}
  @Serialize(AccountDto)
  @UseGuards(JwtGuard)
  @Post('new')
  async createAccount(
    @GetUser() user: User,
    @Body() newAccount: NewAccountDto,
  ) {
    return this.accountService.createAccount(user.email, newAccount);
  }

  @UseGuards(JwtGuard)
  @Get('balance')
  async getBalance(@GetUser() user: User, @Query() query: accTypeDto) {
    return this.accountService.myBalance(user.email, query.accTypeSlug);
  }

  @Serialize(AccountListDto)
  @UseGuards(JwtGuard, new AdminGuard(['ADMIN', 'EDITOR']))
  @Get('/list')
  async listAccounts(@Query() pagination: reqPagination) {
    return this.accountService.listAccounts(pagination);
  }
}
