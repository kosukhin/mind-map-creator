import { NOTIFY_DELAY } from '@/constants/system';
import { createValueApplicative } from '@/domains/application/createValueApplicative';
import { applicative } from '@/domains/branching/Applicative';
import { lazyWatch } from '@/domains/vue/lazyWatch';
import { setValue } from '@/utils/common';
import { ref } from 'vue';

type NotificationMessage = [string, string];

export const notificationMessage = applicative(ref<[string, string]>());
export const notificationMessageValue = applicative(
  () => createValueApplicative(notificationMessage).value(),
);

notificationMessage.ap(lazyWatch((notificationMessageNew: NotificationMessage) => {
  if (notificationMessageNew) {
    setTimeout(() => {
      setValue(notificationMessage, null);
    }, NOTIFY_DELAY);
  }
}));
