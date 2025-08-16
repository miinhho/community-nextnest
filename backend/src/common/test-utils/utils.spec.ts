export const pipeFn =
  (...fns: any[]) =>
  (arg: any) =>
    fns.reduce((acc, fn) => (acc !== undefined ? acc : fn(arg)), undefined);
