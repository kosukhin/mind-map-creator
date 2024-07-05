import { NOTIFY_SUCCESS } from '@/constants/system';
import { buildMapParentTypes } from '@/domains/application/buildMapParentTypes';
import { buildMapToSave } from '@/domains/application/buildMapToSave';
import { defaultValue } from '@/domains/application/defaultValue';
import { ensureNotNullish } from '@/domains/application/ensureNotNullish';
import { valuePath } from '@/domains/application/valuePath';
import { applicative } from '@/domains/branching/Applicative';
import { ap, apToEnd } from '@/domains/branching/ap';
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
import { lazyWatch } from '@/domains/vue/lazyWatch';
import { openRoute } from '@/domains/vue/openRoute';
import { MapStructure } from '@/entities/Map';
import { createMap } from '@/utils/map';
import { mapUrlToName } from '@/utils/mapUrlToName';
import { get, set } from 'lodash';
import partial from 'lodash/partial';

export const useAppInit = () => {
  const init = () => {
    browserWindow
      .ap(currentUrl)
      .ap(mapUrlToName)
      .ap(valuePath)
      .ap(ap(mapsAll, get))
      .ap(tap(apToEnd(mapOpened, set, 'value')))
      .ap(
        tap((map) => applicative(map)
          .ap(tap((cmap: any) => {
            console.log(cmap);
          }))
          .ap(ap(mapsAll, buildMapParentTypes))
          .ap(partial(set, mapParentTypes, 'value'))),
      )
      .ap(tap(partial(setTimeout, openRoute, 1, '/current')));

    mapOpened.ap(lazyWatch(() => {
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
    }, { deep: true }));
  };

  return {
    init,
  };
};
