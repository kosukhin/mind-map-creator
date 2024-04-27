import {
  any,
  applyTo,
  converge,
  defaultTo,
  equals,
  filter,
  identity,
  includes,
  prop,
  toLower,
  useWith,
  values,
  view,
} from 'ramda';
import { lazy } from '@/utils/lazy';
import { ref } from '@vue/reactivity';
import { lensValue } from '@/utils/lensValue';
import { lensObjects } from '@/utils/lensObjects';
import { lensType } from '@/utils/lensType';
import { compose } from '@/utils/cmps';

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

  it('search by type', () => {
    const map = {
      value: {
        objects: {
          test: {
            type: 'ok',
          },
          second: {
            type: 'second',
          },
        },
        types: {
          ok: 'ov',
          tk: 'tv',
        },
      },
    };
    const withMap = applyTo(map);
    const type = ref<string>('ok');
    const withType = applyTo(type);
    const typeComparator = withType(compose(equals, view(lensValue)));
    const getObjects = compose(values, view(compose(lensValue, lensObjects)));
    const findByType = useWith(
      filter(compose(typeComparator, view(lensType))),
      [getObjects],
    );

    console.log('find in map', withMap(findByType));
  });
});
