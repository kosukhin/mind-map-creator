import { Applicative } from '@/domains/branching/Applicative';
import { allMaps } from '@/domains/data/allMaps';
import { currentUrl } from '@/domains/browser/currentUrl';
import { mapUrlToName } from '@/utils/mapUrlToName';
import { get, set } from 'lodash';
import partial from 'lodash/partial';
import { mapOpened } from '@/domains/data/mapOpened';
import { tap } from '@/domains/branching/tap';
import { buildMapParentTypes } from '@/domains/application/buildMapParentTypes';
import { mapParentTypes } from '@/domains/data/mapParentTypes';
import { openRoute } from '@/domains/vue/openRoute';

export const initApplication = () => {
  new Applicative(currentUrl())
    .ap(mapUrlToName) // По урлу получаем имя карты
    .ap(partial(get, allMaps.value)) // По имени получаем объект карты
    .ap(tap(partial(set, mapOpened, 'value'))) // Сохраняем объект
    .ap(
      tap((map) => new Applicative(buildMapParentTypes(map))
        .ap(partial(set, mapParentTypes, 'value'))),
    ) // Строим родительские типы
    .ap(tap(partial(setTimeout, openRoute, 1, '/current'))); // Открываем карту
};
