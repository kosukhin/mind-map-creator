import { AnyFn } from '@/entities/Utils';

const youForgetToCallMe = (fn: AnyFn, prevArgs: any[], ...args: any[]): any => {
  if (args.length === 0) {
    return fn(...prevArgs);
  }

  return youForgetToCallMe.bind(null, fn, prevArgs.concat(args));
};

export const curryVar = (fn: AnyFn) => youForgetToCallMe.bind(null, fn, []);
