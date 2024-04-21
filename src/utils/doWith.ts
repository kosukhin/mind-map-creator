import { AnyFn } from '@/entities/Utils';
import { curry } from 'ramda';

const _doWith = (model: any, fn: AnyFn) => fn(model);
export const doWith = curry(_doWith);
