import {
  __, always,
  any, append,
  applyTo,
  converge,
  defaultTo,
  equals,
  filter, flip,
  identity,
  includes, lensPath,
  prop, set, tap,
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
import { useState } from '@/composables/useState';
import { clone } from 'lodash';
import { cDebug } from '@/utils/common';
import { searchByField, searchByList } from '@/domains/search';

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
    const type = ref<string>('second');
    const withType = applyTo(type);
    const typeValue = lazy(
      withType,
      view(lensValue),
    );
    const typeComparator = converge(equals, [
      typeValue,
      view(lensType),
    ]);
    const getObjects = compose(values, view(compose(lensValue, lensObjects)));
    const findByType = useWith(
      filter(typeComparator),
      [getObjects],
    );

    console.log('find in map', withMap(findByType));
  });

  it('findByName', () => {
    const query = ref('tes');
    const withQuery = applyTo(query);
    const toLowerSafe = compose(toLower, String, defaultTo(''));
    const queryComparator = converge(includes, [
      lazy(withQuery, compose(toLowerSafe, view(lensValue))),
      identity,
    ]);
    const findByName = compose(queryComparator, toLowerSafe, prop('name'));
    const object = {
      name: 'test',
    };
    expect(findByName(object)).toBe(true);
    const object2 = {
      name: 'nope',
    };
    expect(findByName(object2)).toBe(false);
  });

  it('save named search', () => {
    const map = ref({
      objects: { },
      types: { },
    });
    const namedSearchForm = ref({
      name: 'new name',
      query: 'new query',
      type: 'new type',
    });
    const withNamedSearchForm = applyTo(namedSearchForm);
    const appendNamedFormValue = converge(append, [
      lazy(
        withNamedSearchForm,
        compose(clone, view(lensValue)),
      ),
      identity,
    ]);
    const withMap = applyTo(map);
    const [, setMap] = useState(map);
    const lensNamedSearches = compose(lensValue, lensPath(['namedSearches']));
    const namedSearchSave = lazy(
      withMap,
      compose(
        setMap,
        view(lensValue),
        set(lensNamedSearches, __, map),
        appendNamedFormValue,
        defaultTo([]),
        prop('namedSearches'),
      ),
    );
    namedSearchSave();
    console.log(map.value);
  });

  it('search index', () => {
    const map = ref({
      namedSearches: [{ hello: 'worl' }, { buy: 'bu' }],
    });
    const withMap = applyTo(map);
    const namedSearch = converge(prop as any, [
      identity,
      lazy(
        withMap,
        view(compose(lensValue, lensPath(['namedSearches']))),
      ),
    ]) as any;

    console.log(namedSearch(1));
  });

  it('searchByField', () => {
    const findByName = converge(searchByField, [
      always('name'),
      () => 'hel',
      identity,
    ]);

    console.log(findByName({
      name: 'hello',
    }));
  });

  it('searchByList', () => {
    const findByName = converge(searchByList, [
      always('names'),
      () => 'tw',
      identity,
    ]);

    console.log(findByName({
      names: {
        one: 'one',
        two: 'two',
      },
    }));
  });
});
