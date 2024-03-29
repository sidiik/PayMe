import { Module } from '@nestjs/common';
import { AccountModule } from 'src/account/account.module';
import { SeedModule } from 'src/seed/seed.module';
import { TransactionModule } from 'src/transaction/transaction.module';
import { UserModule } from 'src/user/user.module';
import { CacheModule } from '@nestjs/cache-manager';
import { RateModule } from 'src/rate/rate.module';

@Module({
  imports: [
    UserModule,
    AccountModule,
    TransactionModule,
    SeedModule,
    CacheModule.register({
      isGlobal: true,
      ttl: 3600,
    }),
    RateModule,
  ],
})
export class AppModule {}
