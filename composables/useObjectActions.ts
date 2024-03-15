import { useI18n } from 'vue-i18n'
import { findRelationsToRemove } from '~/application'
import { useLayer } from '~/composables/useSharedLayer'
import { useMap } from '~/composables/useSharedMap'
import { useMapObject } from '~/composables/useSharedMapObject'
import { useOverlay } from '~/composables/useSharedOverlay'
import { removeObjectOnLayer, updateObjectOnLayer } from '~/utils/konva'

export function useObjectActions(needConfirm = true) {
  const i18n = useI18n()
  const { layer, layerObjects } = useLayer()
  const { map } = useMap()
  const { currentObject } = useMapObject()
  const { close } = useOverlay()

  const removeCurrentObject = () => {
    if (
      needConfirm &&
      !confirm(i18n.t('formObject.notifications.sureDelete'))
    ) {
      return
    }

    close()
    if (currentObject.value && map.value && layer.value) {
      const relations = findRelationsToRemove(currentObject.value, map.value)
      relations?.map((relations: any) => {
        relations.forEach((relation: any) => {
          relation.indexes.forEach((indexToRemove: any) => {
            map.value?.objects[relation.objectId].arrows.splice(
              indexToRemove,
              1
            )
          })

          if (map.value && layer.value) {
            updateObjectOnLayer(
              layerObjects,
              layer.value,
              map.value.objects[relation.objectId],
              map.value
            )
          }
        })
      })
      delete map.value.objects[currentObject.value.id]
      removeObjectOnLayer(layerObjects, currentObject.value)
    }
  }

  return {
    removeCurrentObject,
  }
}
