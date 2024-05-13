import { modelsPoolGet, modelsPoolSet } from '@/modulesHigh/models/modelsPool';
import { OVERLAY_CLOSE } from '@/constants/overlays';
import { watch } from '@vue/runtime-core';
import {
  onBeforeUnmount, onMounted, WatchStopHandle, ref,
} from 'vue';

export const overlayController = {
  history: ref<string[]>([]),

  tryToClose(name: string) {
    modelsPoolSet('overlayNameToClose', name);
  },

  close() {
    modelsPoolSet('overlayName', OVERLAY_CLOSE);
    modelsPoolSet('overlayNameToClose', OVERLAY_CLOSE);
  },

  autoClose(formName: string) {
    let watcherUnsubscribe: WatchStopHandle | undefined;
    onMounted(() => {
      watcherUnsubscribe = watch(
        () => modelsPoolGet<string>('overlayNameToClose'),
        (nameToClose) => {
          if (nameToClose && nameToClose === formName) {
            overlayController.close();
          }
        },
      );
    });

    onBeforeUnmount(() => {
      if (watcherUnsubscribe) {
        watcherUnsubscribe();
      }
    });
  },
};
