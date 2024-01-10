import { Transform, Type } from 'class-transformer';
import { IsNotEmpty, IsString } from 'class-validator';
import { UserDto } from 'src/user/user.dto';
import { Expose } from 'class-transformer';

export class accTypeDto {
  @IsString()
  @IsNotEmpty()
  accTypeSlug: string;
}

export class NewAccountDto {
  @IsString()
  @IsNotEmpty()
  fullname: string;
  @IsString()
  @IsNotEmpty()
  accTypeSlug: string;
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
  accountType: any;
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
