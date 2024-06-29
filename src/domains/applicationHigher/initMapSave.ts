import { mapOpened } from '@/domains/data/mapOpened';
import { watch } from 'vue';
import { Applicative } from '@/domains/branching/Applicative';
import { mapFileHandler } from '@/domains/data/mapFileHandler';
import { ensureNotNullish } from '@/domains/application/ensureNotNullish';
import { jsonParse } from '@/domains/browser/jsonParse';
import { buildMapToSave } from '@/domains/application/buildMapToSave';
import { mapUrlToName } from '@/utils/mapUrlToName';
import { tap } from '@/domains/branching/tap';
import { MapStructure } from '@/entities/Map';
import { writeToFileHandler } from '@/domains/browser/writeToFileHandler';
import { partial, set } from 'lodash';
import { readFileHandler } from '@/domains/browser/readFileHandler';
import { notificationMessage } from '@/domains/data/notificationMessage';
import { NOTIFY_SUCCESS } from '@/constants/system';

export const initMapSave = () => {
  watch(mapOpened, () => {
    const writeToFile = partial(writeToFileHandler, mapFileHandler.value as FileSystemFileHandle);
    new Applicative(mapFileHandler.value)
      .ap(ensureNotNullish)
      .ap(readFileHandler)
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
