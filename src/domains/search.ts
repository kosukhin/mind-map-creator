import {
  any, append, applyTo, clone, curry, defaultTo, includes, lensPath, pipe, values, view,
} from 'ramda';
import { compose, prop } from '@/utils/cmps';
import { stringToLowerSafe } from '@/domains/string';
import { MapStructure, NamedSearch } from '@/entities/Map';
import { lensValue } from '@/utils/lensValue';
import { setLens } from '@/utils/setLens';

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

const lensNamedSearches = lensPath(['namedSearches']);
export const searchNamedSavePure = (
  searchNamed: NamedSearch,
  map: MapStructure,
) => applyTo(
  map,
  pipe(
    view(lensNamedSearches),
    defaultTo([]),
    append(clone(searchNamed)),
    setLens(lensNamedSearches, map),
  ),
);
