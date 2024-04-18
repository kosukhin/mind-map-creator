import { AnyFn } from '@/entities/Utils';

export type Lens = {
  get: AnyFn,
  set: AnyFn
}

export const lens = (get: AnyFn, set: AnyFn): Lens => ({ get, set });
