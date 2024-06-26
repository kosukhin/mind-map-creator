import { createSharedComposable } from '@vueuse/core';
import { Ref, ref } from 'vue';

export const useKeybindings = createSharedComposable(() => {
  const ctrlSFired = ref(0);
  const ctrlFFired = ref(0);
  const ctrlMFired = ref(0);
  const ctrlHFired = ref(0);
  const keysMap: Record<string, Ref<number>> = {
    KeyS: ctrlSFired,
    KeyF: ctrlFFired,
    KeyM: ctrlMFired,
    KeyH: ctrlHFired,
  };

  document.addEventListener(
    'keydown',
    (e) => {
      if (e.ctrlKey && keysMap[e.code]) {
        e.preventDefault();
        keysMap[e.code].value += 1;
      }
    },
    true,
  );

  return {
    ctrlSFired,
    ctrlFFired,
    ctrlMFired,
    ctrlHFired,
  };
});
