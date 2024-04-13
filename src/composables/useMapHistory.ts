import { useMap } from '@/composables/useMap';
import { createSharedComposable, useRefHistory } from '@vueuse/core';
import debounce from 'lodash/debounce';
import { useMapPartialRenderer } from '@/composables/useMapPartialRenderer';

export const useMapHistory = createSharedComposable(() => {
  const { map, afterMapSavedFns } = useMap();
  const {
    history, commit, canUndo, canRedo, undo, redo,
  } = useRefHistory(map, {
    capacity: 10,
    clone: structuredClone,
    deep: true,
  });
  const { triggerPartialRendering } = useMapPartialRenderer();

  afterMapSavedFns.push(debounce(triggerPartialRendering, 1));

  return {
    history,
    commit,
    canUndo,
    canRedo,
    undo,
    redo,
  };
});
