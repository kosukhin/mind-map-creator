import { ref, watch } from 'vue';
import { createSharedComposable } from '@vueuse/core';
import debounce from 'lodash/debounce';
import { useMap } from '@/composables/useMap';

export const useHashChange = createSharedComposable(() => {
  const hashChanged = ref<string>();
  const { firstMapLoad } = useMap();
  const getHashFromUrl = (url: string) => url.split('#')[1] ?? null;
  const clearHash = debounce(() => {
    // eslint-disable-next-line no-restricted-globals
    location.hash = '';
  }, 500);
  window.addEventListener('hashchange', (e) => {
    hashChanged.value = getHashFromUrl(e.newURL);
    clearHash();
  });
  watch(firstMapLoad, () => {
    setTimeout(() => {
      // eslint-disable-next-line no-restricted-globals
      hashChanged.value = getHashFromUrl(location.href);
      clearHash();
    });
  });

  return { hashChanged };
});
