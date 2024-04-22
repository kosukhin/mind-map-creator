import { AnyFn } from '@/entities/Utils';
import { curry } from 'ramda';

export const ensureThen = curry((condition: any, fn: AnyFn) => condition && fn());
