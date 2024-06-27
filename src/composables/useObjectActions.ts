import { createSharedComposable } from '@vueuse/core';
import { useI18n } from 'vue-i18n';
import { useMapObject } from '@/composables/useMapObject';
import { useOverlay } from '@/composables/useOverlay';
import { removeObjectOnLayer, updateObjectOnLayer } from '@/utils/konva';
import { findRelationsToRemove } from '@/application/findRelationsToRemove';
import { mapOpened } from '@/domains/data/mapOpened';

export const useObjectActions = createSharedComposable((needConfirm = true) => {
  const i18n = useI18n();
  const map = mapOpened;
  const { currentObject } = useMapObject();
  const { close } = useOverlay();

  const removeCurrentObject = () => {
    if (
      needConfirm
      // eslint-disable-next-line no-restricted-globals
      && !confirm(i18n.t('general.notifications.sureDelete'))
    ) {
      return;
    }

    close();
    if (currentObject.value && map.value && layer.value) {
      const relations = findRelationsToRemove(currentObject.value, map.value);
      relations?.forEach((relationsObj: any) => {
        relationsObj.forEach((relation: any) => {
          relation.indexes.forEach((indexToRemove: any) => {
            map.value?.objects[relation.objectId].arrows.splice(
              indexToRemove,
              1,
            );
          });

          if (map.value && layer.value) {
            updateObjectOnLayer(
              layerObjects,
              layer.value,
              map.value.objects[relation.objectId],
              map.value,
            );
          }
        });
      });
      delete map.value.objects[currentObject.value.id];
      removeObjectOnLayer(layerObjects, currentObject.value);
    }
  };

  return {
    removeCurrentObject,
  };
});
