import { compose } from '@/utils/cmps';
import {
  fromPairs, lensPath, map, set, toPairs,
} from 'ramda';

export const formResetPure = compose(
  fromPairs,
  map(set(lensPath([1]), '')),
  toPairs,
);
