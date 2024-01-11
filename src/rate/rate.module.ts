import { Module } from '@nestjs/common';
import { RateController } from './rate.controller';
import { RateService } from './rate.service';
import { AccountModule } from 'src/account/account.module';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  controllers: [RateController],
  providers: [RateService],
  exports: [RateService],
  imports: [AccountModule, PrismaModule],
})
export class RateModule {}
