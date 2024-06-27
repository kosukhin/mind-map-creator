import { ref } from 'vue';
import { createSharedComposable } from '@vueuse/core';
import debounce from 'lodash/debounce';

export const useHashChange = createSharedComposable(() => {
  const hashChanged = ref<string>();
  const getHashFromUrl = (url: string) => url.split('#')[1] ?? null;
  const clearHash = debounce(() => {
    // eslint-disable-next-line no-restricted-globals
    location.hash = '';
  }, 500);
  window.addEventListener('hashchange', (e) => {
    hashChanged.value = getHashFromUrl(e.newURL);
    clearHash();
  });

  return { hashChanged };
});
