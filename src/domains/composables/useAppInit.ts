import { Applicative } from '@/domains/branching/Applicative';
import { currentUrl } from '@/domains/browser/currentUrl';
import { mapUrlToName } from '@/utils/mapUrlToName';
import partial from 'lodash/partial';
import { get, set } from 'lodash';
import { mapsAll } from '@/domains/data/mapsAll';
import { tap } from '@/domains/branching/tap';
import { mapOpened } from '@/domains/data/mapOpened';
import { buildMapParentTypes } from '@/domains/application/buildMapParentTypes';
import { mapParentTypes } from '@/domains/data/mapParentTypes';
import { openRoute } from '@/domains/vue/openRoute';
import { watch } from 'vue';
import { writeToFileHandler } from '@/domains/browser/writeToFileHandler';
import { mapFileHandler } from '@/domains/data/mapFileHandler';
import { ensureNotNullish } from '@/domains/application/ensureNotNullish';
import { readFileHandler } from '@/domains/browser/readFileHandler';
import { defaultValue } from '@/domains/application/defaultValue';
import { createMap } from '@/utils/map';
import { jsonParse } from '@/domains/browser/jsonParse';
import { MapStructure } from '@/entities/Map';
import { buildMapToSave } from '@/domains/application/buildMapToSave';
import { notificationMessage } from '@/domains/data/notificationMessage';
import { NOTIFY_SUCCESS } from '@/constants/system';

export const useAppInit = () => {
  const init = () => {
    new Applicative(currentUrl())
      .ap(mapUrlToName) // По урлу получаем имя карты
      .ap(partial(get, mapsAll.value)) // По имени получаем объект карты
      .ap(tap(partial(set, mapOpened, 'value'))) // Сохраняем объект
      .ap(
        tap((map) => new Applicative(buildMapParentTypes(map))
          .ap(partial(set, mapParentTypes, 'value'))),
      ) // Строим родительские типы
      .ap(tap(partial(setTimeout, openRoute, 1, '/current'))); // Открываем карту

    watch(mapOpened, () => {
      const writeToFile = partial(writeToFileHandler, mapFileHandler.value as FileSystemFileHandle);
      new Applicative(mapFileHandler.value)
        .ap(ensureNotNullish)
        .ap(readFileHandler)
        .ap(partial(
          defaultValue,
          `{"current":${JSON.stringify(createMap('current'))}}`,
        ))
        .ap(jsonParse)
        .ap(tap((mapFileContent) => {
          new Applicative(mapOpened.value)
            .ap(ensureNotNullish)
            .ap(tap((map: MapStructure) => {
              new Applicative(map.url)
                .ap(mapUrlToName)
                .ap(partial(buildMapToSave, map, mapFileContent))
                .ap(writeToFile)
                .ap(tap(() => {
                  set(notificationMessage, 'value', ['Успешно сохранено', NOTIFY_SUCCESS]);
                }));
            }));
        }));
    }, { deep: true });
  };

  return {
    init,
  };
};
