import {
  applyDecorators,
  CallHandler,
  ConflictException,
  ExecutionContext,
  Injectable,
  InternalServerErrorException,
  Logger,
  NestInterceptor,
  NotFoundException,
  SetMetadata,
  UseInterceptors,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PrismaError } from 'prisma-error-enum';
import { catchError, Observable, throwError } from 'rxjs';

const defaultErrorMessage: PrismaErrorInfoType = {
  RecordsNotFound: '요청한 리소스를 찾을 수 없습니다.',
  UniqueConstraintViolation: '이미 존재하는 데이터입니다.',
  Default: '데이터베이스 오류가 발생했습니다.',
};

/**
 * Prisma 에러를 HTTP 에러로 처리하는 인터셉터
 *
 * PrismaErrorHandler 데코레이터로 사용되어야 하며, 해당 데코레이터에 정의된 에러 메시지를 사용합니다.
 *
 * @throws {NotFoundException} - RecordsNotFound 에러 코드가 발생한 경우
 * @throws {ConflictException} - UniqueConstraintViolation 에러 코드가 발생한 경우
 * @throws {InternalServerErrorException} - 기타 Prisma 에러 코드가 발생한 경우
 */
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
          this.logger.warn(`Unique constraint violation in ${className}.${methodName}`, error.meta);
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

type PrismaErrorKey = keyof typeof PrismaError | 'Default';

export type PrismaErrorInfoType = Partial<Record<PrismaErrorKey, string>>;

export const PRISMA_ERROR_INFO_KEY = Symbol('prisma-error-info');

/**
 *
 * Prisma 에러 핸들러 데코레이터
 *
 * 이 데코레이터는 Prisma 에러를 처리하기 위한 인터셉터를 적용합니다.
 *
 * @param info - Prisma 에러 코드와 사용자 정의 메시지를 매핑하는 객체입니다.
 *
 * @property Default - 기본 에러 메시지
 *
 * @throws {NotFoundException} - RecordsNotFound 에러 코드가 발생한 경우
 * @throws {ConflictException} - UniqueConstraintViolation 에러 코드가 발생한 경우
 * @throws {InternalServerErrorException} - 기타 Prisma 에러 코드가 발생한 경우
 *
 * @example
 * ```
 * ＠PrismaErrorHandler({
 *  RecordsNotFound: '알림을 찾을 수 없습니다.',
 *  Default: '알림 조회 중 오류 발생',
 * })
 * async findNotifyById(id: string) { ... }
 * ```
 */
export const PrismaErrorHandler = (info: PrismaErrorInfoType) =>
  applyDecorators(
    UseInterceptors(PrismaErrorInterceptor),
    SetMetadata(PRISMA_ERROR_INFO_KEY, info),
  );
