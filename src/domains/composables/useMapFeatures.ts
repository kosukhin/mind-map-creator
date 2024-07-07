import { computed } from 'vue';
import { mapUrlToName } from '@/utils/mapUrlToName';
import { mapOpened } from '@/domains/data/mapOpened';
import { placeholder } from 'lodash/fp';
import { get, partial } from 'lodash';

export const useMapFeatures = () => {
  const mapName = computed(() => mapOpened
    .ap(partial(get, placeholder, 'value.url', '/current'))
    .ap(mapUrlToName));

  return {
    mapName,
  };
};
