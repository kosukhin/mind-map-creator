import {
  get,
  partial,
  set,
} from 'lodash';
import { lens } from '@/utils/lens';

export const lensPath = (path: string, defaultValue: any, target: any) => lens(
  partial(get, target, path, defaultValue),
  partial(set, target, path, partial.placeholder),
);
