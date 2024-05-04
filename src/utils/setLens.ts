import { curry, set } from 'ramda';
import { AnyFn } from '@/entities/Utils';

export const setLens = curry((lens: AnyFn, source: any, value: any) => set(lens, value, source));
