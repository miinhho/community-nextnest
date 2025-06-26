/**
 * 사용자가 차단한 사용자와 차단된 사용자를 제외한 Prisma 용 `where` 필터를 생성합니다.
 * @param userId - 필터링할 사용자 ID
 * @returns - 필터 객체 (`userId` 가 없는 경우 빈 객체)
 */
export const getBlockFilter = (userId?: string) => {
  return userId
    ? {
        author: {
          blocked: {
            none: {
              id: userId,
            },
          },
          blocker: {
            none: {
              id: userId,
            },
          },
        },
      }
    : {};
};
