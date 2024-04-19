import { AnyFn } from '@/entities/Utils';
import { curryVar } from '@/utils/curryVar';

const _doWith = (model: any, fn: AnyFn, ...rest: any) => {
  console.log('do with fn', fn);
  console.log('do with rest', rest);
  return fn(model);
};
export const doWith = curryVar(_doWith);
