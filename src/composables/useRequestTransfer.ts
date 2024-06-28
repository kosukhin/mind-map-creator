import { useRequestSaveMap } from '@/composables/useRequestSaveMap';
import { useRouter } from '@/composables/useRouter';
import { isNullish } from '@/utils/isNullish';
import { mapUrlToName } from '@/utils/mapUrlToName';
import { partial } from 'lodash';
import { unref } from 'vue';
import { tryToGetMapByName } from '@/domains/application/tryToGetMapByName';
import { ensureNotNullish } from '@/domains/application/ensureNotNullish';
import { Applicative } from '@/domains/branching/Applicative';
import { tap } from '@/domains/branching/tap';
import { MapStructure } from '@/entities/Map';

const { saveMap } = useRequestSaveMap();
const { push } = useRouter();

const transferMap = async (mapUrl: string, payload: any) => {
  const mapName = mapUrlToName(mapUrl);
  new Applicative(mapName)
    .ap(tryToGetMapByName)
    .ap(ensureNotNullish)
    .ap(tap((map: MapStructure) => {
      map.objects[Date.now()] = unref(payload.object);

      [map.types[payload.type.id]].filter(isNullish).forEach(() => {
        map.types[payload.type.id] = payload.type;
      });

      saveMap(map, mapName).then(partial(push, mapUrl));
    }));
};

export function useRequestTransfer() {
  return {
    transferMap,
  };
}
