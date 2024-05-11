import { MapObject, MapStructure, MapType } from '@/entities/Map';
import { ListItem } from '@/modules/types/ListItem';
import { compose, property } from 'lodash/fp';
import { isNotNullish } from '@/utils/isNotNullish';

const isTypesNotNullish = compose(isNotNullish, property('types'));

export const mapTransformer = {
  // Elements of map what can be displayed in menu
  menuItems(map: MapStructure) {
    return Object.values(map.objects)
      .filter((object) => object.inMenu)
      .sort((a, b) => a.menuOrder - b.menuOrder);
  },
  // List of map types usefully for dropdowns
  typesList(map: MapStructure): ListItem[] {
    return Object.entries(map.types).map(([typeId, mapType]) => ({
      id: typeId,
      name: mapType.name,
    }));
  },
  // Array of map's objects
  getObjects(map: MapStructure): MapObject[] {
    return Object.values(map.objects);
  },
  parentTypes(parentsData: MapStructure[]) {
    return parentsData
      .filter(isTypesNotNullish)
      .map((parent) => Object.values(parent.types) as MapType[])
      .flat();
  },
};
