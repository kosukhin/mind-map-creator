import { partial } from 'ramda';
import { AnyFn } from '@/entities/Utils';

export const lazy: AnyFn = (fn: AnyFn, ...args: any[]) => partial(fn, args);
