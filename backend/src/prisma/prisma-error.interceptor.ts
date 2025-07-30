import {
  PRISMA_ERROR_INFO_KEY,
  PrismaErrorInfoType,
} from '@/prisma/prisma-error-handler.decorator';
import {
  CallHandler,
  ConflictException,
  ExecutionContext,
  Injectable,
  InternalServerErrorException,
  Logger,
  NestInterceptor,
  NotFoundException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PrismaError } from 'prisma-error-enum';
import { catchError, Observable, throwError } from 'rxjs';

const defaultErrorMessage: PrismaErrorInfoType = {
  RecordsNotFound: '요청한 리소스를 찾을 수 없습니다.',
  UniqueConstraintViolation: '이미 존재하는 데이터입니다.',
  Default: '데이터베이스 오류가 발생했습니다.',
};

@Injectable()
export class PrismaErrorInterceptor implements NestInterceptor {
  private readonly logger = new Logger(PrismaErrorInterceptor.name);

  constructor(private reflector: Reflector) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      catchError((error) => {
        const methodName = context.getHandler().name;
        const className = context.getClass().name;
        const errorMessage = this.getPrismaErrorMessage(context, error.code);

        if (error.code === PrismaError.RecordsNotFound) {
          this.logger.warn(`Record not found in ${className}.${methodName}`, error.meta);
          return throwError(() => new NotFoundException(errorMessage));
        }

        if (error.code === PrismaError.UniqueConstraintViolation) {
          this.logger.warn(
            `Unique constraint violation in ${className}.${methodName}`,
            error.meta,
          );
          return throwError(() => new ConflictException(errorMessage));
        }

        // 기타 Prisma 에러
        if (error.code?.startsWith('P')) {
          this.logger.error(`Prisma error in ${className}.${methodName}`, error.stack);
          return throwError(() => new InternalServerErrorException(errorMessage));
        }

        return throwError(() => error);
      }),
    );
  }

  private getPrismaErrorMessage(context: ExecutionContext, errorCode: string) {
    const extractPrismaErrorInfo = () => {
      const handler = context.getHandler();
      return this.reflector.get<PrismaErrorInfoType>(PRISMA_ERROR_INFO_KEY, handler);
    };

    const getPrismaErrorKey = () => {
      for (const errorKey in PrismaError) {
        if (PrismaError[errorKey] === errorCode) {
          return errorCode;
        }
      }
    };

    const errorInfo = extractPrismaErrorInfo();
    const errorKey = getPrismaErrorKey()!;

    const errorMessage: string =
      errorInfo[errorKey] ||
      defaultErrorMessage[errorKey] ||
      errorInfo['Default'] ||
      defaultErrorMessage['Default'];

    return errorMessage;
  }
}
