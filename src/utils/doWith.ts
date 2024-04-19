import { AnyFn } from '@/entities/Utils';
import { curryVar } from '@/utils/curryVar';

const _doWith = (model: any, fn: AnyFn, ...rest: any) => fn(model);
export const doWith = curryVar(_doWith);
