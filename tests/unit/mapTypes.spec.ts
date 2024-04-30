import { lazy } from '@/utils/lazy';
import { compose } from '@/utils/cmps';
import {
  applySpec,
  applyTo,
  assoc, concat, defaultTo, map as rMap, prop, toPairs, view,
} from 'ramda';
import { lensTypes } from '@/utils/lensTypes';
import { lensValue } from '@/utils/lensValue';
import { useMapTypes } from '@/composables/useMapTypes';
import { useMap } from '@/composables/useMap';
import { createMap } from '@/utils/map';
import { ref, unref } from 'vue';

describe('map types', () => {
  it('should build types', () => {
    const map = {
      value: {
        types: {
          ok: 'ov',
          tk: 'tv',
        },
      },
    };
    const withMap = applyTo(map);
    const mapTypes2 = lazy(
      withMap,
      compose(
        concat([{ id: null, name: 'Любой тип узла' }]),
        rMap(applySpec({
          id: prop('0') as any,
          name: prop('1') as any,
        })),
        toPairs,
        defaultTo({}),
        view(lensTypes),
        defaultTo({}),
        view(lensValue),
      ),
    );
    console.log('map types', mapTypes2());
  });

  it('add type to map', () => {
    const map = ref(createMap('test', 'test'));
    const { mapTypeAdd } = useMapTypes(map);
    mapTypeAdd({
      name: 'test',
    });

    console.log(map.value.types);
  });
});
