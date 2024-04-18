import { AnyFn } from '@/entities/Utils';

export const curryVar = (fn: AnyFn) => (...allArgs: any[]) => {
  const innerCurry = (...args: any[]) => {
    if (args.length === 0) {
      return fn(...allArgs);
    }

    allArgs = allArgs.concat(...args);
    return innerCurry;
  };

  return innerCurry;
};
