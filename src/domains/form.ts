import { compose } from '@/utils/cmps';
import {
  fromPairs, lensPath, map as rMap, set, toPairs,
} from 'ramda';

export const formResetPure = compose(
  fromPairs,
  rMap(set(lensPath([1]), '')),
  toPairs,
);
