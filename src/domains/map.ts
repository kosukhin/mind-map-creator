import {
  always,
  applySpec,
  applyTo,
  ascend,
  assoc,
  concat,
  converge,
  curry,
  equals,
  filter,
  identity,
  map,
  path,
  prop,
  sort,
  toPairs,
  values,
  view,
} from 'ramda';
import { defaultToObject } from '@/utils/defaultToObject';
import { lensValue } from '@/utils/lensValue';
import { lensObjects } from '@/utils/lensObjects';
import { lensTypes } from '@/utils/lensTypes';
import { lensName } from '@/utils/lensName';
import { setLens } from '@/utils/setLens';
import { MapObject, MapStructure, MapType } from '@/entities/Map';
import { compose, pipe } from '@/utils/cmps';
import { lensType } from '@/utils/lensType';

const FIELD_IN_MENU = 'inMenu';
const FIELD_MENU_ORDER = 'menuOrder';
const equalsTrue = equals(true);

const lensValueObjects = compose(lensValue, lensObjects);
const byInMenu = pipe(prop(FIELD_IN_MENU), equalsTrue);
const byMenuOrder = ascend(prop(FIELD_MENU_ORDER) as any);

// Список объектов на карте
export const mapObjectsGet = pipe(view(lensValueObjects), defaultToObject, values);

// Объекты доступные для вывода в меню
export const mapMenuObjects = pipe(mapObjectsGet, filter(byInMenu), sort(byMenuOrder));

// Добавляем в типы карты новый тип
export const mapTypeAdd = curry((mapObj: MapStructure, mapType: MapType) => applyTo(
  mapType,
  pipe(
    converge(
      assoc,
      [
        view(lensName),
        identity,
        () => view(lensTypes, mapObj),
      ],
    ),
    setLens(lensTypes, mapObj),
  ),
));

const FIELD_NAME = 'name';
const ANY_NODE = 'Любой тип узла';

// Список типов
export const mapTypesListPure = compose(
  concat([{ id: null, name: ANY_NODE }]),
  map(applySpec({
    id: prop('0'),
    name: path(['1', FIELD_NAME]),
  })),
  toPairs,
  defaultToObject,
  view(compose(lensValue, lensTypes)),
);

// Поиск объектов по имени типа
export const mapObjectsComparatorByType = (typeName: string, mapObject: MapObject) => equals(
  typeName,
  view(lensType, mapObject),
);
