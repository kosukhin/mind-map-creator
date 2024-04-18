import { AnyFn } from '@/entities/Utils';
import { curryVar } from '@/utils/curryVar';

export const ensureThen = curryVar((condition: boolean, fn: AnyFn) => condition && fn());
