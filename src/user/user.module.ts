import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { AuthService } from 'src/auth/auth.service';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from 'src/auth/strategies/auth.strategy';
import { RefreshStrategy } from 'src/auth/strategies/refresh.strategy';

@Module({
  controllers: [UserController],
  providers: [UserService, AuthService, JwtStrategy, RefreshStrategy],
  exports: [UserService],
  imports: [
    PrismaModule,
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET,
    }),
  ],
})
export class UserModule {}
