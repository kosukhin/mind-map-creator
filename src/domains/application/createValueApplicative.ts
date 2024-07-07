import { ensureNotNullish } from '@/domains/application/ensureNotNullish';
import { Applicative } from '@/domains/branching/Applicative';
import { get, partial } from 'lodash';
import { placeholder } from 'lodash/fp';

export const createValueApplicative = (applicative: Applicative) => applicative
  .ap(partial(get, placeholder, 'value'))
  .ap(ensureNotNullish);
