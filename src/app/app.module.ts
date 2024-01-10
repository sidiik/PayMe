import { Module } from '@nestjs/common';
import { AccountModule } from 'src/account/account.module';
import { SeedModule } from 'src/seed/seed.module';
import { TransactionModule } from 'src/transaction/transaction.module';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [UserModule, AccountModule, TransactionModule, SeedModule],
})
export class AppModule {}
