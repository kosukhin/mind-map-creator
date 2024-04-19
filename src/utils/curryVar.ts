import { AnyFn } from '@/entities/Utils';

const innerCurry = (fn: AnyFn, prevArgs: any[], ...args: any[]): any => {
  if (args.length === 0) {
    return fn(...prevArgs);
  }

  return innerCurry.bind(null, fn, prevArgs.concat(args));
};

export const curryVar = (fn: AnyFn) => innerCurry.bind(null, fn, []);
