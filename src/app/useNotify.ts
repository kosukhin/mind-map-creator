import { ref, watch } from 'vue';
import { createSharedComposable } from '@vueuse/core';
import { setValue } from '@/utils/common';
import { NOTIFY_DELAY } from '@/constants/system';
import { branchCombinator } from '@/modules/combinators/branchCombinator';
import { time } from '@/modulesHigh/browser/time';

export const useNotify = createSharedComposable(() => {
  const message = ref<[string, string]>();

  watch(message, (newMessage) => {
    branchCombinator.when(
      newMessage,
      () => {
        time.delay(NOTIFY_DELAY).then(() => {
          setValue(message, null);
        });
      },
    );
  });

  return {
    message,
  };
});
