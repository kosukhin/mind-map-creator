import {
  any, applyTo, curry, includes, pipe, values,
} from 'ramda';
import { compose, prop } from '@/utils/cmps';
import { stringToLowerSafe } from '@/domains/string';

export const searchQueryComparator = curry((query: string, field: string) => includes(
  stringToLowerSafe(query),
  stringToLowerSafe(field),
));

export const searchByField = (fieldName: string, query: string, source: any) => applyTo(
  source,
  pipe(
    prop(fieldName),
    searchQueryComparator(query) as any,
  ),
);

export const searchByList = (fieldName: string, query: string, source: any) => applyTo(
  source,
  pipe(
    prop(fieldName),
    values as any,
    any(compose(searchQueryComparator(query))),
  ),
);
