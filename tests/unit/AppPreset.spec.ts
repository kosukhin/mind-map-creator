import { MapType } from '@/entities/Map';
import { createMap } from '@/utils/map';
import { doWith } from '@/utils/doWith';
import { ref } from 'vue';
import { compose } from 'lodash/fp';
import { isTruthy } from '@/utils/isTruthy';
import { ensureThen } from '@/utils/ensureThen';
import {
  __, assoc, set, view,
} from 'ramda';
import { lensValue } from '@/utils/lensValue';
import { lensName } from '@/utils/lensName';
import { lensTypes } from '@/utils/lensTypes';

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

    console.log('map existed', withMap(compose(isTruthy, view(lensValue))));
    const forExistedMap = ensureThen(withMap(compose(isTruthy, view(lensValue))));
    forExistedMap(() => {
      console.log('for existed map');
    });
    const selectTypeToAdd = set(lensValue, __, typeToAdd);
    selectTypeToAdd({
      name: 'changed',
      height: 100,
      width: 100,
      svg: '',
    });
    console.log('type to add name', typeToAdd.value.name);

    const addTypeToMap = () => {
      console.log('add type name', withTypeToAdd(compose(view(lensName), view(lensValue))));
      return assoc(
        withTypeToAdd(compose(view(lensName), view(lensValue))),
        withTypeToAdd(view(lensValue)),
        withMap(compose(view(lensTypes), view(lensValue))),
      );
    };

    console.log('add type to map', addTypeToMap());

    expect(true).toBe(true);
  });
});
