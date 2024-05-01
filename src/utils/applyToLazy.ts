import { curry } from 'ramda';
import { AnyFn } from '@/entities/Utils';

export const applyToLazy = curry((data: any, fn: AnyFn) => fn.bind(null, data));
