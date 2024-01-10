import { Module } from '@nestjs/common';
import { AccountController } from './account.controller';
import { AccountService } from './account.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { UserModule } from 'src/user/user.module';

@Module({
  controllers: [AccountController],
  providers: [AccountService],
  imports: [UserModule, PrismaModule],
  exports: [AccountService],
})
export class AccountModule {}
