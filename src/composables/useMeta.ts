import { reactive, watchEffect } from 'vue';
import { createSharedComposable } from '@vueuse/core';
import { ReactiveHead } from '@vueuse/head';

export const useMeta = createSharedComposable(() => {
  const head = reactive<ReactiveHead>({
    title: 'Идет загрузка...',
  });

  watchEffect(() => {
    document.title = String(head.title);
  });

  return {
    head,
  };
});
