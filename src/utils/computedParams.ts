import { AnyFn } from '@/entities/Utils';

export const computedParams = (fn: AnyFn, ...args: AnyFn[]) => fn(...args.map((argFn) => argFn()));
