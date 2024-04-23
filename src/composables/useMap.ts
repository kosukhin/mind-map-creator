import { mapNormalizeBeforeSave } from '@/application/mapNormalizeBeforeSave';
import { useRequestGetMap } from '@/composables/useRequestGetMap';
import { useRequestSaveMap } from '@/composables/useRequestSaveMap';
import { useNotify } from '@/composables/useNotify';
import { MAP_UPDATED } from '@/constants/messages';
import { NOTIFY_ERROR, NOTIFY_SUCCESS } from '@/constants/system';
import { MapStructure, MapType } from '@/entities/Map';
import { setError, setValue, setValues } from '@/utils/common';
import { mapUrlToName } from '@/utils/mapUrlToName';
import { computed, ref } from 'vue';
import { watch } from '@vue/runtime-core';
import { createSharedComposable } from '@vueuse/core';
import { debounce } from 'lodash';
import { useRoute } from 'vue-router';
import { AnyFn } from '@/entities/Utils';
import { applyTo } from 'ramda';

export const useMap = createSharedComposable(() => {
  const { message } = useNotify();
  const firstMapLoad = ref(false);
  const parentTypes = ref<MapType[]>([]);
  const map = ref<MapStructure>();
  const mapError = ref({ error: null });
  const route = useRoute();
  const mapName = ref(route.path.replace('/', ''));
  const { getMap } = useRequestGetMap();
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
  const isLoadingDeffered = computed({
    get: () => isLoading.value,
    set: debounce((v) => {
      isLoading.value = v;
    }, 1000),
  });
  const openMapOfCurrentUrl = () => {
    firstMapLoad.value = false;
    mapName.value = mapUrlToName(route.path);
    isLoading.value = true;

    getMap(mapName.value)
      .then(([vMap, vParentTypes]) => {
        setValues([
          [map, vMap],
          [parentTypes, vParentTypes],
          [firstMapLoad, true],
        ]);
        isLoadingDeffered.value = false;
      })
      .catch(setError(mapError.value));
  };

  watch(
    route,
    openMapOfCurrentUrl,
    {
      immediate: true,
    },
  );

  const withMap = applyTo(map);

  return {
    map,
    withMap,
    firstMapLoad,
    parentTypes,
    mapName,
    openMapOfCurrentUrl,
    isLoading,
    afterMapSavedFns,
  };
});
