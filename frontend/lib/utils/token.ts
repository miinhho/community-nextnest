export const tokenUtils = {
  get: () => localStorage.getItem('access-token'),
  set: (token: string) => localStorage.setItem('access-token', token),
  remove: () => localStorage.removeItem('access-token'),
  exists: () => !!localStorage.getItem('access-token'),
};
