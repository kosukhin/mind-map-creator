import { AnyFn } from '@/entities/Utils';
import { curryVar } from '@/utils/curryVar';

export const computedParams = curryVar((fn: AnyFn, ...args: AnyFn[]) => fn(...args.map((argFn) => argFn())));
