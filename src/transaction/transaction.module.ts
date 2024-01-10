import { Module } from '@nestjs/common';
import { TransactionController } from './transaction.controller';
import { TransactionService } from './transaction.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { UserModule } from 'src/user/user.module';
import { AccountModule } from 'src/account/account.module';

@Module({
  controllers: [TransactionController],
  providers: [TransactionService],
  imports: [UserModule, AccountModule, PrismaModule],
})
export class TransactionModule {}
