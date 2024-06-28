import { mapOpened } from '@/domains/data/mapOpened';
import { watch } from 'vue';
import { Applicative } from '@/domains/branching/Applicative';
import { mapFileHandler } from '@/domains/data/mapFileHandler';
import { ensureNotNullish } from '@/domains/application/ensureNotNullish';
import { readFile } from '@/libraries/browser-fs';
import { jsonParse } from '@/domains/browser/jsonParse';
import { buildMapToSave } from '@/domains/application/buildMapToSave';
import { mapUrlToName } from '@/utils/mapUrlToName';
import { tap } from '@/domains/branching/tap';
import { MapStructure } from '@/entities/Map';
import { writeToFileHandler } from '@/domains/browser/writeToFileHandler';
import { partial } from 'lodash';

export const initMapSave = () => {
  watch(mapOpened, () => {
    const writeToFile = partial(writeToFileHandler, mapFileHandler.value);
    new Applicative(mapFileHandler.value)
      .ap(ensureNotNullish)
      .ap(readFile)
      .ap(jsonParse)
      .ap(tap((mapFileContent) => {
        new Applicative(mapOpened.value)
          .ap(ensureNotNullish)
          .ap(tap((map: MapStructure) => {
            const contentToSave = buildMapToSave(mapUrlToName(map.url), map, mapFileContent);
            writeToFile(contentToSave).then(() => {
              console.log('saved!');
            });
          }));
      }));
  }, { deep: true });
};
