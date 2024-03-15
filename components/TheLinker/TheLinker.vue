<script lang="ts" setup>
import { ref } from '@vue/reactivity'
import { watch } from '@vue/runtime-core'
import { useI18n } from 'vue-i18n'
import BaseButton from '~/components/BaseButton/BaseButton.vue'
import {
  useLayer,
  useLocks,
  useMap,
  useMapObject,
} from '~/composables'
import { updateObjectOnLayer } from '~/utils/konva'

const { layer, layerObjects } = useLayer()
const { map } = useMap()
const { currentObjectId } = useMapObject()
const { isClickLocked } = useLocks()
const i18n = useI18n()
const title = ref(i18n.t('theLinker.makeRelation'))
const type = ref('default')
let stopNextObjectWatcher: Function | null = null
const startRelation = () => {
  if (type.value === 'danger') {
    if (stopNextObjectWatcher) {
      stopNextObjectWatcher()
    }
    title.value = i18n.t('theLinker.makeRelation')
    isClickLocked.value = false
    type.value = 'default'
    return
  }
  currentObjectId.value = undefined
  title.value = i18n.t('theLinker.chooseSource')
  isClickLocked.value = true
  type.value = 'danger'
  stopNextObjectWatcher = watch(currentObjectId, () => {
    if (!stopNextObjectWatcher) return
    stopNextObjectWatcher()
    title.value = i18n.t('theLinker.chooseTarget')
    type.value = 'success'
    const fromObjectId = currentObjectId.value ?? ''

    const stopSecond = watch(currentObjectId, () => {
      stopSecond()
      const toObjectId = String(currentObjectId.value ?? '')
      title.value = i18n.t('theLinker.makeRelation')
      isClickLocked.value = false
      type.value = 'default'

      if (map.value && layer.value) {
        map.value.objects[fromObjectId].arrows.push({ id: toObjectId })
        updateObjectOnLayer(
          layerObjects,
          layer.value,
          map.value.objects[fromObjectId],
          map.value
        )
      }
    })
  })
}
</script>

<template>
  <BaseButton class="TheLinker" :type="type" @click="startRelation">
    {{ title }}
  </BaseButton>
</template>
