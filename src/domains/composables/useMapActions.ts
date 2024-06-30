import { Applicative } from '@/domains/branching/Applicative';
import { mapFileHandler } from '@/domains/data/mapFileHandler';
import { ensureNotNullish } from '@/domains/application/ensureNotNullish';
import { partial } from 'lodash';
import { openRoute } from '@/domains/vue/openRoute';
import { mapOpened } from '@/domains/data/mapOpened';
import { MapType } from '@/entities/Map';
import { mapAddType } from '@/domains/application/mapAddType';

export const useMapActions = () => {
  const mapRemove = () => new Applicative(mapFileHandler.value)
    .ap(ensureNotNullish)
    .ap((fileHandle: any) => fileHandle.remove())
    .ap(partial(openRoute, '/'))
    .promise();

  const addType = (type: MapType) => new Applicative(mapOpened.value).ap(partial(mapAddType, type));

  return {
    mapRemove,
    addType,
  };
};
