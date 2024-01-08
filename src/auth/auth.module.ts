import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserModule } from 'src/user/user.module';

@Module({
  providers: [AuthService],
  exports: [AuthService],
  imports: [UserModule],
})
export class AuthModule {}
