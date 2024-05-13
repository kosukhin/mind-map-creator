import { AnyFn } from '@/entities/Utils';

export const arrayHelper = {
  filter(arr: any[], cb: AnyFn) {
    return arr.filter(cb);
  },
  concat(arr: any[], arr2: any[]) {
    return arr.concat(arr2);
  },
  last(arr: any[]) {
    return arr.at(-1);
  },
  withoutLast(arr: any[]) {
    return arr.length - 1 > 0 ? arr.slice(0, arr.length - 1) : [];
  },
};
