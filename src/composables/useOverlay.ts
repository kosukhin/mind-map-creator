import { OVERLAY_CLOSE } from '@/constants/overlays';
import { Dictionary } from '@/entities/Dictionary';
import { setValue } from '@/utils/common';
import { computed, ref } from '@vue/reactivity';
import { watch } from '@vue/runtime-core';
import { AnyFn, createSharedComposable } from '@vueuse/core';
import { applyTo } from 'ramda';
import { useState } from '@/composables/useState';

export const useOverlay = createSharedComposable(() => {
  const overlayName = ref<string>();
  const tryToClose = ref<string>();
  const history = ref<string[]>([]);
  const onOpenCbs: Dictionary<any> = {};
  const isClosed = computed(() => overlayName.value === OVERLAY_CLOSE);
  const open = (newName: string) => {
    overlayName.value = newName;
  };
  const onOpen = (openName: string, cb: AnyFn) => {
    if (!onOpenCbs[openName]) {
      onOpenCbs[openName] = [];
    }
    onOpenCbs[openName].push(cb);
  };
  const close = () => {
    setValue(overlayName, OVERLAY_CLOSE);
    setValue(tryToClose, OVERLAY_CLOSE);
  };
  const isOpened = (maybeName: string) => overlayName.value === maybeName;
  watch(overlayName, () => {
    if (overlayName.value) {
      if (overlayName.value !== OVERLAY_CLOSE) {
        if (onOpenCbs[overlayName.value]) {
          onOpenCbs[overlayName.value].forEach((cb: any) => cb());
        }
        history.value.push(overlayName.value);
      } else {
        setValue(history, []);
      }
    }
  });

  const withOverlayName = applyTo(overlayName);
  const [, setTryToClose] = useState(tryToClose);

  return {
    overlayName,
    withOverlayName,
    tryToClose,
    setTryToClose,
    history,
    isClosed,
    onOpen,
    open,
    close,
    isOpened,
  };
});
