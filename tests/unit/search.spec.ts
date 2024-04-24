import {
  any,
  applyTo,
  compose,
  converge,
  defaultTo,
  equals,
  identity,
  includes,
  prop,
  tap,
  toLower,
  values,
} from 'ramda';
import { cDebug, debug } from '@/utils/common';
import { lazy } from '@/utils/lazy';

describe('search', () => {
  it('item', () => {
    const searchQuery = 'He';
    const withQuery = applyTo(searchQuery);
    const object = {
      additionalFields: {
        hello: 'world',
        hello2: 'hell2O',
      },
    };
    const toLowerSafe = compose(toLower, String, defaultTo('') as any);
    const queryComparator = converge(includes, [lazy(withQuery, toLowerSafe), identity]);
    const isFoundInAdditionalFilters = compose(
      any(compose(queryComparator, toLowerSafe) as any) as any,
      values,
      prop('additionalFields'),
    );

    console.log('test', isFoundInAdditionalFilters(object));
  });
});
