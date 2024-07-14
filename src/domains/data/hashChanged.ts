import { createApplicativeWithInitializator } from '@/domains/application/createApplicativeWithInitializator';
import { debounce } from 'lodash';
import { ref } from 'vue';

const getHashFromUrl = (url: string) => url.split('#')[1] ?? null;
const clearHash = debounce(() => {
  // eslint-disable-next-line no-restricted-globals
  location.hash = '';
}, 500);
export const hashChanged = createApplicativeWithInitializator(
  ref<string>(),
  (dep) => {
    window.addEventListener('hashchange', (e) => {
      dep.value = getHashFromUrl(e.newURL);
      clearHash();
    });
  },
);
