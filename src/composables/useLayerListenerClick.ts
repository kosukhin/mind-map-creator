import { Ref, watch } from 'vue';
import { createSharedComposable } from '@vueuse/core';
import debounce from 'lodash/debounce';
import { useLayerEvents } from '@/composables/useLayerEvents';
import { useSideBar } from '@/composables/useSideBar';
import { useMapObject } from '@/composables/useMapObject';
import { useOverlay } from '@/composables/useOverlay';
import { useLocks } from '@/composables/useLocks';
import { mapObjectClick } from '@/application/mapObjectClick';
import { openUrlByObject } from '@/utils/map';
import { mapOpened } from '@/domains/data/mapOpened';

export const useLayerListenerClick = createSharedComposable(() => {
  const { click, tap, stageClick } = useLayerEvents();
  const map = mapOpened.value();
  const { isSidebarOpen } = useSideBar();
  const { currentObjectId, fastPreviewObjectId, fastPreviewIsLocked } = useMapObject();
  const { overlayName } = useOverlay();
  const { isClickLocked } = useLocks();

  watch(stageClick, () => {
    isSidebarOpen.value = false;
    if (fastPreviewObjectId.value) {
      console.log('stage clicked');
      // eslint-disable-next-line no-unused-expressions
      stageClick.value && (stageClick.value.cancelBubble = true);
      fastPreviewObjectId.value = undefined;
    }
  });

  const onClick = (eventRef: Ref<any>) => {
    if (eventRef.value && map.value) {
      const result = mapObjectClick(isClickLocked.value)([
        eventRef.value,
        map.value,
      ]);
      if (result.currentObjectId && map.value) {
        if (map.value.objects[result.currentObjectId]) {
          map.value.objects[result.currentObjectId].lastClick = Date.now();
          map.value.position = map.value.objects[result.currentObjectId].position;
        }
      }
      if (result.openUrlByObject) {
        openUrlByObject(result.openUrlByObject);
        return;
      }
      if (
        result.currentObjectId
        && !result.openUrlByObject
        && map.value.objects[result.currentObjectId]
      ) {
        if (
          !fastPreviewIsLocked.value
          && (!fastPreviewObjectId.value
            || fastPreviewObjectId.value !== result.currentObjectId)) {
          // eslint-disable-next-line no-unused-expressions
          eventRef.value && (eventRef.value.cancelBubble = true);
          fastPreviewObjectId.value = result.currentObjectId;
          return;
        }
        // eslint-disable-next-line no-unused-expressions
        eventRef.value && (eventRef.value.cancelBubble = true);
        currentObjectId.value = result.currentObjectId ?? undefined;
        overlayName.value = result.overlayName ?? undefined;
        fastPreviewObjectId.value = undefined;
      }
    }
  };

  watch(
    click,
    debounce(() => {
      onClick(click);
    }, 200),
  );

  watch(tap, () => {
    onClick(tap);
  });

  return {
    onClick,
  };
});
