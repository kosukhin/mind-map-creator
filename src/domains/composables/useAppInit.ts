import { NOTIFY_SUCCESS } from '@/constants/system';
import { buildMapParentTypes } from '@/domains/application/buildMapParentTypes';
import { buildMapToSave } from '@/domains/application/buildMapToSave';
import { defaultValue } from '@/domains/application/defaultValue';
import { ensureNotNullish } from '@/domains/application/ensureNotNullish';
import { applicative } from '@/domains/branching/Applicative';
import { ap } from '@/domains/branching/ap';
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
import { browserWindow } from '@/domains/io/browserWindow';
import { openRoute } from '@/domains/vue/openRoute';
import { MapStructure } from '@/entities/Map';
import { createMap } from '@/utils/map';
import { mapUrlToName } from '@/utils/mapUrlToName';
import { get, set } from 'lodash';
import partial from 'lodash/partial';
import { watch } from 'vue';

export const useAppInit = () => {
  const init = () => {
    browserWindow
      .ap(currentUrl) // От браузера берем урл
      .ap(tap(console.log.bind(console, 'curl')))
      .ap(mapUrlToName) // По урлу получаем имя карты
      .ap(tap(console.log.bind(console, 'map name is')))
      .ap(ap(mapsAll, get)) // По имени получаем объект карты
      .ap(tap(console.log.bind(console, 'map object is')))
      .ap(tap(partial(set, mapOpened, 'value'))) // Сохраняем объект
      .ap( // Строим родительские типы
        tap((map) => applicative(map)
          .ap(tap((cmap: any) => {
            console.log(cmap);
          }))
          .ap(ap(mapsAll, buildMapParentTypes))
          .ap(partial(set, mapParentTypes, 'value'))),
      )
      .ap(tap(partial(setTimeout, openRoute, 1, '/current'))); // Открываем карту

    watch(mapOpened, () => {
      const writeToFile = partial(writeToFileHandler, mapFileHandler.value().value as FileSystemFileHandle);
      applicative(mapFileHandler.value().value)
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
