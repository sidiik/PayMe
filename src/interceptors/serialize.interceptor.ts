import {
  CallHandler,
  ExecutionContext,
  NestInterceptor,
  UseInterceptors,
} from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { Response } from 'express';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { ApiResponse } from 'src/helpers/ApiResponse';

interface ClassConstructor {
  new (...args: any[]): {};
}

export function Serialize(dto: ClassConstructor) {
  return UseInterceptors(new SerializeInterceptor(dto));
}

export class SerializeInterceptor implements NestInterceptor {
  constructor(private dto: ClassConstructor) {}
  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> | Promise<Observable<any>> {
    const response: Response = context.switchToHttp().getResponse();
    return next.handle().pipe(
      map((data) => {
        const transformedData = plainToInstance(this.dto, data, {
          excludeExtraneousValues: true,
        });

        return ApiResponse.Success(transformedData, response.statusCode);
      }),
      catchError((error) => {
        response.status(error.status);
        console.log(error);
        return of(
          ApiResponse.Failure(
            [error.response.message],
            response.statusCode,
            error.message,
          ),
        );
      }),
    );
  }
}
