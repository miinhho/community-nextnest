import { Role } from '@prisma/client';

/**
 * JWT 토큰의 Payload 인터페이스
 */
export interface JwtPayload {
  /** 사용자 ID (Subject) */
  sub: string;
  /** 사용자 역할 */
  role: Role;
}

export interface TokenPair {
  accessToken: string;
  refreshToken: string;
}
