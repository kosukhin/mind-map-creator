import { AnyFn } from '@/entities/Utils';

export const provide = (fn: AnyFn) => () => fn();
