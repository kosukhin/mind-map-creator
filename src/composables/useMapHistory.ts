import { createSharedComposable, useRefHistory } from '@vueuse/core';
import { mapOpened } from '@/domains/data/mapOpened';

export const useMapHistory = createSharedComposable(() => {
  const {
    history, commit, canUndo, canRedo, undo, redo,
  } = useRefHistory(mapOpened, {
    capacity: 10,
    clone: structuredClone,
    deep: true,
  });

  return {
    history,
    commit,
    canUndo,
    canRedo,
    undo,
    redo,
  };
});
