import { Type } from 'class-transformer';
import { IsNotEmpty, IsNumberString, isNumberString } from 'class-validator';
import { UserDto } from 'src/user/user.dto';
import { Expose } from 'class-transformer';
import { resPagination } from 'src/DTOs/pagination.dto';

export class NewAccountDto {
  @IsNumberString()
  @IsNotEmpty()
  phoneNumber: string;
}

export class AccountPhone {
  @Expose()
  number: string;
  @Expose()
  @Type(() => UserDto)
  User: UserDto;
}

export class AccountDto {
  @Expose()
  id: number;
  @Expose()
  accountNumber: string;
  @Expose()
  balance: number;
  @Expose()
  @Type(() => AccountPhone)
  Phone: AccountPhone;
}

export class AccountListDto {
  @Expose()
  @Type(() => AccountDto)
  accounts: AccountDto;
  @Expose()
  page: number;
  @Expose()
  size: number;
  @Expose()
  totalPages: number;
  @Expose()
  totalCount: number;
}
