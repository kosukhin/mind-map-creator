import {
  assoc, converge, identity, pipe, view,
} from 'ramda';
import { compose } from '@/utils/cmps';
import { lensName } from '@/utils/lensName';
import { MapStructure } from '@/entities/Map';
import { Ref } from 'vue';
import { lensValue } from '@/utils/lensValue';
import { lensTypes } from '@/utils/lensTypes';
import { setRef } from '@/utils/setRef';
import { setLens } from '@/utils/setLens';

export const useMapTypes = (map: Ref<MapStructure | undefined>) => {
  const lensValueTypes = compose(lensValue, lensTypes);
  const mapTypeAdd = pipe(
    converge(
      assoc,
      [
        view(lensName),
        identity,
        () => view(lensValueTypes, map),
      ],
    ),
    setLens(lensValueTypes, map),
    view(lensValue),
    setRef(map),
  );

  return {
    mapTypeAdd,
  };
};
