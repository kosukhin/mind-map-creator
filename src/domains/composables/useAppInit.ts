import { NOTIFY_SUCCESS } from '@/constants/system';
import { buildMapParentTypes } from '@/domains/application/buildMapParentTypes';
import { buildMapToSave } from '@/domains/application/buildMapToSave';
import { defaultValue } from '@/domains/application/defaultValue';
import { ensureNotNullish } from '@/domains/application/ensureNotNullish';
import { applicative } from '@/domains/branching/Applicative';
import { tap } from '@/domains/branching/tap';
import { currentUrl } from '@/domains/browser/currentUrl';
import { jsonParse } from '@/domains/browser/jsonParse';
import { readFileHandler } from '@/domains/browser/readFileHandler';
import { writeToFileHandler } from '@/domains/browser/writeToFileHandler';
import { mapFileHandler } from '@/domains/data/mapFileHandler';
import { mapOpened } from '@/domains/data/mapOpened';
import { mapParentTypes } from '@/domains/data/mapParentTypes';
import { mapsAll } from '@/domains/data/mapsAll';
import { notificationMessage } from '@/domains/data/notificationMessage';
import { openRoute } from '@/domains/vue/openRoute';
import { MapStructure } from '@/entities/Map';
import { createMap } from '@/utils/map';
import { mapUrlToName } from '@/utils/mapUrlToName';
import { get, set } from 'lodash';
import partial from 'lodash/partial';
import { watch } from 'vue';

export const useAppInit = () => {
  const init = () => {
    applicative(currentUrl())
      .ap(mapUrlToName) // По урлу получаем имя карты
      .ap(partial(get, mapsAll.value)) // По имени получаем объект карты
      .ap(tap(partial(set, mapOpened, 'value'))) // Сохраняем объект
      .ap( // Строим родительские типы
        tap((map) => applicative((map))
          .ap(buildMapParentTypes)
          .ap(partial(set, mapParentTypes, 'value'))),
      )
      .ap(tap(partial(setTimeout, openRoute, 1, '/current'))); // Открываем карту

    watch(mapOpened, () => {
      const writeToFile = partial(writeToFileHandler, mapFileHandler.value as FileSystemFileHandle);
      applicative(mapFileHandler.value)
        .ap(ensureNotNullish)
        .ap(readFileHandler) // Читаем содержимое файла
        .ap(partial( // Если контент карты пуст - создаем из заготовки
          defaultValue,
          `{"current":${JSON.stringify(createMap('current'))}}`,
        ))
        .ap(jsonParse)
        .ap(tap((mapFileContent) => {
          applicative(mapOpened.value)
            .ap(ensureNotNullish)
            .ap(tap((map: MapStructure) => {
              applicative(map.url)
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
