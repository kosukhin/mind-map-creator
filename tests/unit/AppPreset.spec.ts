import { MapType } from '@/entities/Map';
import { createMap } from '@/utils/map';
import partial from 'lodash/partial';
import { get, set } from 'lodash';
import { doWith } from '@/utils/doWith';
import { ref, unref } from 'vue';
import { compose } from 'lodash/fp';
import { isTruthy } from '@/utils/isTruthy';
import { computedParams } from '@/utils/computedParams';
import { ensureThen } from '@/utils/ensureThen';

describe('AppPreset', () => {
  it('add type', () => {
    const map = ref(createMap('test', 'test'));
    const withMap = doWith(map);
    const typeToAdd = ref<MapType>({
      name: 'test',
      height: 100,
      width: 100,
      svg: '',
    });
    const withTypeToAdd = doWith(typeToAdd);

    const typesPath = partial(get, partial.placeholder, 'types', []);
    const namePath = partial(get, partial.placeholder, 'name', 'noname');

    const mapTypes = withMap(compose(typesPath, unref));
    console.log('mapTypes', mapTypes());

    const mapExisted = withMap(compose(isTruthy, unref));
    console.log('mapExisted', mapExisted());

    const setTypeToMap = computedParams(set, mapTypes, withTypeToAdd(compose(namePath, unref)), partial(unref, typeToAdd));
    const forExistedMap = ensureThen(mapExisted);
    console.log('call setToMap', forExistedMap(setTypeToMap));
    console.log('map', map.value);

    expect(true).toBe(true);
  });
});
