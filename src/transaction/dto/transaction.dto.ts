import { Expose, Transform, Type } from 'class-transformer';
import {
  IsBoolean,
  IsBooleanString,
  IsDateString,
  IsNotEmpty,
  IsNumber,
  IsNumberString,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { reqPagination } from 'src/DTOs/pagination.dto';
import { AccountPhone, accTypeDto } from 'src/account/dto/account.dto';

export class Deposit {
  @IsNumberString()
  @IsNotEmpty()
  phoneNumber: string;

  @IsNumber()
  amount: number;

  @IsString()
  @IsNotEmpty()
  description: string;

  @ValidateNested()
  @IsNotEmpty()
  @Type(() => accTypeDto)
  accType: accTypeDto;
}

export class TransactionFilters {
  @IsString()
  @IsOptional()
  type: string;

  @IsString()
  @IsNotEmpty()
  accTypeSlug: string;

  @IsNumberString()
  @IsOptional()
  phoneNumber: string;
  @IsDateString()
  @IsOptional()
  startDate: string;
  @IsDateString()
  @IsOptional()
  endDate: string;

  @IsOptional()
  @Type(() => reqPagination)
  pagination: reqPagination = {
    page: 1,
    size: 5,
  };
}

export class User {
  @Expose()
  @Type(() => AccountPhone)
  Phone: AccountPhone;
}

export class TransactionList {
  @Expose()
  id: number;
  @Expose()
  accountType: any;
  @Expose()
  amount: number;
  @Expose()
  description: string;
  @Expose()
  type: string;
  @Expose()
  createdAt: string;
  @Expose()
  sender_id: number;
  @Expose()
  reciever_id: number;
  @Expose()
  @Type(() => User)
  reciever: User;
  @Type(() => User)
  @Expose()
  sender: User;
}

export class TransactionListDto {
  @Expose()
  @Type(() => TransactionList)
  transactions: TransactionList[];
  @Expose()
  page: number;
  @Expose()
  size: number;
  @Expose()
  totalPages: number;
  @Expose()
  totalCount: number;
}

export class transferMoneyDto {
  @IsNumberString()
  @IsNotEmpty()
  phoneNumber: string;
  @IsNumber()
  @IsNotEmpty()
  amount: number;
  @Type(() => accTypeDto)
  @ValidateNested()
  @IsNotEmpty()
  accType: accTypeDto;
}
