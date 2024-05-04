import { AnyFn } from '@/entities/Utils';
import { compose as rCompose, pipe as rPipe, prop as rProp } from 'ramda';

export const compose: AnyFn = rCompose;
export const pipe: AnyFn = rPipe;
export const prop: AnyFn = rProp;
