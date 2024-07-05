import { ensureNotNullish } from '@/domains/application/ensureNotNullish';
import { mapAddType } from '@/domains/application/mapAddType';
import { applicative } from '@/domains/branching/Applicative';
import { mapFileHandler } from '@/domains/data/mapFileHandler';
import { mapOpened } from '@/domains/data/mapOpened';
import { openRoute } from '@/domains/vue/openRoute';
import { MapType } from '@/entities/Map';
import { partial } from 'lodash';

export const useMapActions = () => {
  const mapRemove = () => applicative(mapFileHandler.value)
    .ap(ensureNotNullish)
    .ap((fileHandle: any) => fileHandle.remove())
    .ap(partial(openRoute, '/'))
    .promise();

  const addType = (type: MapType) => mapOpened
    .ap(ensureNotNullish)
    .ap(partial(mapAddType, type));

  return {
    mapRemove,
    addType,
  };
};
