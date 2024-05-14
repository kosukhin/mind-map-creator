import { modelsPoolGet, modelsPoolSet } from '@/modulesHigh/models/modelsPool';
import { ref } from '@vue/reactivity';
import { watch } from '@vue/runtime-core';
import { useMagicKeys } from '@vueuse/core';
import { branchCombinator } from '@/modules/combinators/branchCombinator';
import { computed } from 'vue';
import { arrayHelper } from '@/modules/common/arrayHelper';

export const useOverlay = (overlayName: string) => {
  const isOpened = ref(false);
  const history = computed(
    () => modelsPoolGet<string[]>('overlayHistory'),
  );
  const isBackPossible = computed(() => history.value.length > 1);
  const back = () => {
    const newHistory = arrayHelper.withoutLast(history.value);
    modelsPoolSet('overlayHistory', newHistory);
    branchCombinator.when(newHistory.length, () => {
      modelsPoolSet('overlayName', arrayHelper.last(newHistory));
    });
  };
  const close = () => {
    modelsPoolSet('overlayNameToClose', overlayName);
    modelsPoolSet('overlayHistory', []);
  };

  watch(
    () => modelsPoolGet<string>('overlayName'),
    (watchedOverlayName) => {
      isOpened.value = watchedOverlayName === overlayName;
      const lastName = arrayHelper.last(history.value);
      branchCombinator.when(
        isOpened.value && watchedOverlayName !== lastName,
        () => {
          modelsPoolSet(
            'overlayHistory',
            arrayHelper.concat(history.value, [overlayName]),
          );
        },
      );
    },
  );

  const { current } = useMagicKeys();
  watch(current, () => {
    branchCombinator.when(
      isOpened.value && current.has('escape'),
      close,
    );
  });

  return {
    isOpened,
    back,
    isBackPossible,
    close,
    history,
  };
};
