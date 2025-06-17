import { Role } from '@prisma/client';

/**
 * 사용자의 기본 정보를 나타내는 인터페이스
 *
 * 인증된 사용자의 최소 필수 정보를 포함합니다.
 */
export interface UserData {
  /** 사용자 고유 ID */
  id: string;
  /** 사용자 역할 */
  role: Role;
}

/**
 * 사용자가 관리자 권한을 가지고 있는지 확인합니다.
 *
 * @param user - 확인할 사용자 정보
 * @returns 관리자 여부 (true: 관리자, false: 일반 사용자)
 *
 * @example
 * ```
 * const user: UserData = { id: '123', role: Role.ADMIN };
 * if (isAdmin(user)) {
 *   // 관리자 전용 로직
 * }
 * ```
 */
export const isAdmin = (user: UserData): boolean => {
  return user.role === Role.ADMIN;
};
