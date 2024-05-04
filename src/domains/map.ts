import {
  applyTo,
  ascend,
  assoc,
  compose,
  converge,
  curry,
  equals,
  filter,
  identity,
  pipe,
  prop,
  sort,
  values,
  view,
} from 'ramda';
import { defaultToObject } from '@/utils/defaultToObject';
import { lensValue } from '@/utils/lensValue';
import { lensObjects } from '@/utils/lensObjects';
import { lensTypes } from '@/utils/lensTypes';
import { lensName } from '@/utils/lensName';
import { setLens } from '@/utils/setLens';
import { MapStructure, MapType } from '@/entities/Map';

const lensValueObjects = compose(lensValue, lensObjects);
const byInMenu = pipe(prop('inMenu'), equals(true));
const objectsField = pipe(view(lensValueObjects), defaultToObject, values);
const byMenuOrder = ascend(prop('menuOrder') as any);

// Объекты доступные для вывода в меню
export const mapMenuObjects = pipe(objectsField, filter(byInMenu), sort(byMenuOrder));

// Добавляем в типы карты новый тип
export const mapTypeAdd = curry((map: MapStructure, mapType: MapType) => applyTo(
  mapType,
  pipe(
    converge(
      assoc,
      [
        view(lensName),
        identity,
        () => view(lensTypes, map),
      ],
    ),
    setLens(lensTypes, map),
  ),
));
