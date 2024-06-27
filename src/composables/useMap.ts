import { mapNormalizeBeforeSave } from '@/application/mapNormalizeBeforeSave';
import { useRequestSaveMap } from '@/composables/useRequestSaveMap';
import { useNotify } from '@/composables/useNotify';
import { MAP_UPDATED } from '@/constants/messages';
import { NOTIFY_ERROR, NOTIFY_SUCCESS } from '@/constants/system';
import { MapStructure, MapType } from '@/entities/Map';
import { setError, setValue } from '@/utils/common';
import { ref } from 'vue';
import { watch } from '@vue/runtime-core';
import { createSharedComposable } from '@vueuse/core';
import { AnyFn } from '@/entities/Utils';
import { modelsPoolSet } from '@/modulesHigh/models/modelsPool';

export const useMap = createSharedComposable(() => {
  const { message } = useNotify();
  const firstMapLoad = ref(false);
  const parentTypes = ref<MapType[]>([]);
  const map = ref<MapStructure>();
  modelsPoolSet('map', map);
  const mapName = ref('current');
  const mapError = ref({ error: null });
  const { saveMap } = useRequestSaveMap();
  const afterMapSavedFns: AnyFn[] = [];

  watch(
    map,
    () => {
      if (map.value) {
        // eslint-disable-next-line no-restricted-globals
        const normalMap = mapNormalizeBeforeSave(map.value, location.pathname);
        saveMap(normalMap, mapName.value)
          .then(() => {
            setValue(message, [MAP_UPDATED, NOTIFY_SUCCESS]);
            afterMapSavedFns.forEach((fn) => fn());
          })
          .catch((e) => {
            setError(mapError.value, String(e));
            setValue(message, [mapError.value.error, NOTIFY_ERROR]);
          });
      }
    },
    {
      deep: true,
    },
  );

  const isLoading = ref(false);
  const openMapOfCurrentUrl = (mapValue: MapStructure, parentsTypes: MapType[]) => {
    isLoading.value = false;

    console.log('open map of current url');
    map.value = mapValue;
    parentTypes.value = parentsTypes;
  };

  return {
    map,
    firstMapLoad,
    parentTypes,
    mapName,
    openMapOfCurrentUrl,
    isLoading,
    afterMapSavedFns,
  };
});
