import { createParamDecorator, ExecutionContext } from '@nestjs/common';

/**
 * 요청 헤더에서 클라이언트 정보를 추출하는 유틸리티 함수
 * @returns IP 주소와 User-Agent 정보
 */
const getClientInfo = (headers?: any): ClientInfoType => {
  return {
    ipAddress: (headers['x-forwarded-for'] || headers['x-real-ip']) as string,
    userAgent: headers['user-agent'] as string,
  };
};

/**
 * 클라이언트 정보 타입 정의
 * @property ipAddress - 클라이언트의 IP 주소
 * @property userAgent - 클라이언트의 User-Agent 정보
 */
export type ClientInfoType = {
  ipAddress: string;
  userAgent: string;
};

/**
 * HTTP 요청 헤더에서 클라이언트 정보를 추출하는 데코레이터
 * @returns IP 주소와 User-Agent 정보
 *
 * @example
 * ```
 * async findPostById(
 *  ＠ClientInfo() clientInfo?: ClientInfoType,
 * ) {
 *  const { ipAddress, userAgent } = clientInfo;
 * }
 * ```
 */
export const ClientInfo = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const headers = request.headers;
    return getClientInfo(headers);
  },
);
