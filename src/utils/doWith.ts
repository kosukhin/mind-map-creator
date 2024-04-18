import { AnyFn } from '@/entities/Utils';
import { curryVar } from '@/utils/curryVar';

const _doWith = (model: any, fn: AnyFn) => {
  console.log('do with', model, fn);
  return fn(model);
};
export const doWith = curryVar(_doWith);
