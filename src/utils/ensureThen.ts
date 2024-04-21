import { AnyFn } from '@/entities/Utils';
import { curry } from 'ramda';

export const ensureThen = curry((condition: AnyFn, fn: AnyFn) => condition() && fn());
