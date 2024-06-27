import { AnyFn, createSharedComposable } from '@vueuse/core';
import { watch } from '@vue/runtime-core';
import { updateObjectOnLayer } from '@/utils/konva';
import { useLayer } from '@/composables/useLayer';
import { useMapObject } from '@/composables/useMapObject';
import { useLocks } from '@/composables/useLocks';
import { useI18n } from 'vue-i18n';
import { ref } from '@vue/reactivity';
import { mapOpened } from '@/domains/data/mapOpened';

export const useObjectLinker = createSharedComposable((defaultTitle?: string) => {
  const { layer, layerObjects } = useLayer();
  const map = mapOpened;
  const { currentObjectId, fastPreviewIsLocked } = useMapObject();
  const { isClickLocked } = useLocks();
  const i18n = useI18n();
  const title = ref(defaultTitle ?? i18n.t('general.makeRelation'));
  const type = ref('standard');
  let stopNextObjectWatcher: AnyFn | null = null;

  const startToRelation = (fromObjectId: number) => {
    fastPreviewIsLocked.value = true;
    currentObjectId.value = undefined;
    isClickLocked.value = true;
    title.value = i18n.t('general.chooseTarget');
    type.value = 'success';

    const stopToRelation = watch(currentObjectId, () => {
      fastPreviewIsLocked.value = false;
      stopToRelation();
      const toObjectId = String(currentObjectId.value ?? '');
      title.value = i18n.t('general.makeRelation');
      isClickLocked.value = false;
      type.value = 'standard';

      if (map.value && layer.value) {
        map.value.objects[fromObjectId].arrows.push({ id: toObjectId });
        updateObjectOnLayer(
          layerObjects,
          layer.value,
          map.value.objects[fromObjectId],
          map.value,
        );
      }
    });
  };

  const startRelation = () => {
    if (type.value === 'danger') {
      if (stopNextObjectWatcher) {
        stopNextObjectWatcher();
      }
      title.value = i18n.t('general.makeRelation');
      isClickLocked.value = false;
      type.value = 'standard';
      return;
    }
    fastPreviewIsLocked.value = true;
    currentObjectId.value = undefined;
    title.value = i18n.t('general.chooseSource');
    isClickLocked.value = true;
    type.value = 'danger';
    stopNextObjectWatcher = watch(currentObjectId, () => {
      if (!stopNextObjectWatcher) return;
      stopNextObjectWatcher();
      title.value = i18n.t('general.chooseTarget');
      type.value = 'success';
      const fromObjectId = currentObjectId.value ?? '';

      const stopSecond = watch(currentObjectId, () => {
        fastPreviewIsLocked.value = false;
        stopSecond();
        const toObjectId = String(currentObjectId.value ?? '');
        title.value = i18n.t('general.makeRelation');
        isClickLocked.value = false;
        type.value = 'standard';

        if (map.value && layer.value) {
          map.value.objects[fromObjectId].arrows.push({ id: toObjectId });
          updateObjectOnLayer(
            layerObjects,
            layer.value,
            map.value.objects[fromObjectId],
            map.value,
          );
        }
      });
    });
  };

  return {
    startRelation,
    startToRelation,
    type,
    title,
  };
});
