import { Applicative } from '@/domains/branching/Applicative';
import { allMaps } from '@/domains/data/allMaps';
import { currentUrl } from '@/domains/browser/currentUrl';
import { mapUrlToName } from '@/utils/mapUrlToName';
import { get, set } from 'lodash';
import partial from 'lodash/partial';
import { mapOpened } from '@/domains/data/mapOpened';
import { tap } from '@/domains/branching/tap';

export const initApplication = () => {
  // Записываем текущую карту
  new Applicative(currentUrl())
    .ap(mapUrlToName)
    .ap(
      tap((mapName) => new Applicative(mapName)
        .ap(partial(get, allMaps.value))
        .ap(partial(set, mapOpened, 'value'))),
    )
    .ap(
      tap((mapName) => new Applicative(mapName)
        .ap(partial(get, allMaps.value))
        .ap(partial(set, mapOpened, 'value'))),
    );

  // Записываем родительские типы
  new Applicative(allMaps.value)
    .ap(console.log);

  // Открываем текущую карту по урлу
  new Applicative(allMaps.value)
    .ap(console.log);
};
