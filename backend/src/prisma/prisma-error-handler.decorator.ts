import { PrismaErrorInterceptor } from '@/prisma/prisma-error.interceptor';
import { applyDecorators, SetMetadata, UseInterceptors } from '@nestjs/common';
import { PrismaError } from 'prisma-error-enum';

type PrismaErrorKey = keyof typeof PrismaError | 'Default';

export type PrismaErrorInfoType = Partial<Record<PrismaErrorKey, string>>;

export const PRISMA_ERROR_INFO_KEY = Symbol('prisma-error-info');

const PrismaErrorInfo = (info: PrismaErrorInfoType) =>
  SetMetadata(PRISMA_ERROR_INFO_KEY, info);

export const PrismaErrorHandler = (info: PrismaErrorInfoType) =>
  applyDecorators(UseInterceptors(PrismaErrorInterceptor), PrismaErrorInfo(info));
