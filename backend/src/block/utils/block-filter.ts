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
