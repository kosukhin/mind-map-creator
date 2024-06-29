import { ref, watch } from 'vue';
import { setValue } from '@/utils/common';
import { NOTIFY_DELAY } from '@/constants/system';

export const notificationMessage = ref<[string, string]>();

watch(notificationMessage, () => {
  if (notificationMessage.value) {
    setTimeout(() => {
      setValue(notificationMessage, null);
    }, NOTIFY_DELAY);
  }
});
