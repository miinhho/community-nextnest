export const executeAction = async <T>({
  actionFn,
}: {
  actionFn: () => Promise<T>;
}): Promise<{ success: boolean }> => {
  try {
    await actionFn();
    return {
      success: true,
    };
  } catch {
    return {
      success: false,
    };
  }
};
