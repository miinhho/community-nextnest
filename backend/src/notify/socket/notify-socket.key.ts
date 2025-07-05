/**
 * 유저 ID를 기반으로 소켓 룸 이름을 생성합니다.
 */
export const getUserRoom = (userId: string): string => `user:${userId}`;

export const MARK_AS_READ_EVENT = 'MARK_AS_READ' as const;
export const MARK_ALL_AS_READ_EVENT = 'MARK_ALL_AS_READ' as const;
