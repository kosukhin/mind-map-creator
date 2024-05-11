import { mapMutator } from '@/modules/map/mapMutator';
import { MapStructure, MapType } from '@/entities/Map';
import { modelsPoolGet } from '@/modulesHigh/models/modelsPool';
import { mapBuildParentMapNames } from '@/application/mapBuildParentMapNames';
import { computed } from 'vue';
import { Dictionary } from '@/entities/Dictionary';
import { mapTransformer } from '@/modules/map/mapTransformer';
import { mapUrlToName } from '@/utils/mapUrlToName';

/**
 * MapTypes included in application as presets
 */
export const useMapTypes = () => {
  const addType = (type: MapType) => {
    const map = modelsPoolGet<MapStructure>('map');
    mapMutator.addType(map, type);
  };

  const parentTypes = computed(() => {
    const map = modelsPoolGet<MapStructure>('map');
    const allMaps = modelsPoolGet<Dictionary<MapStructure>>('allMaps');
    const mapName = mapUrlToName(map.url);
    const parentNames = mapBuildParentMapNames(mapName);
    const parentsData = parentNames.map((parentMapName) => allMaps[parentMapName]);
    return mapTransformer.parentTypes(parentsData);
  });

  return {
    addType,
    parentTypes,
  };
};
