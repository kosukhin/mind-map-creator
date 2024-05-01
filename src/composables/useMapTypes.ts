import {
  __, applyTo, assoc, converge, identity, set, view,
} from 'ramda';
import { compose } from '@/utils/cmps';
import { lensName } from '@/utils/lensName';
import { useState } from '@/composables/useState';
import { MapStructure } from '@/entities/Map';
import { Ref } from 'vue';
import { lensValue } from '@/utils/lensValue';
import { lensTypes } from '@/utils/lensTypes';

export const useMapTypes = (map: Ref<MapStructure | undefined>) => {
  const [, setMap] = useState(map);
  const withMap = applyTo(map);

  const lensValueTypes = compose(lensValue, lensTypes);
  const mapTypeAdd = compose(setMap, view(lensValue), set(lensValueTypes, __, map), converge(
    assoc,
    [
      view(lensName),
      identity,
      () => withMap(view(lensValueTypes)),
    ],
  ));

  return {
    mapTypeAdd,
  };
};
