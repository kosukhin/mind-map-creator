import { compose } from '@/utils/cmps';
import { isTruthy } from '@/utils/isTruthy';
import { view } from 'ramda';
import { lensValue } from '@/utils/lensValue';

export const isValueFilled = compose(isTruthy, view(lensValue));
