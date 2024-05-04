import { compose } from '@/utils/cmps';
import { defaultTo, toLower } from 'ramda';

export const stringToLowerSafe = compose(toLower, String, defaultTo(''));
