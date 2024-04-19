import { AnyFn } from '@/entities/Utils';
import { curryVar } from '@/utils/curryVar';

export const ensureThen = curryVar((condition: AnyFn, fn: AnyFn) => condition() && fn());
