<script lang="ts" setup>
import { watch } from '@vue/runtime-core'
import { ref } from '@vue/reactivity'
import { useI18n } from 'vue-i18n'
import {
  useSharedMap,
  useSharedLayer,
  useSharedMapObject,
  useSharedLocks,
} from '~/composables'
import { all } from '~/utils'
import { updateObjectOnLayer } from '~/utils/konva'
import BaseButton from '~/components/BaseButton/BaseButton.vue'

const { layer, layerObjects } = useSharedLayer()
const { map } = useSharedMap()
const { currentObjectId } = useSharedMapObject()
const { isClickLocked } = useSharedLocks()
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
  currentObjectId.value = null
  title.value = i18n.t('theLinker.chooseSource')
  isClickLocked.value = true
  type.value = 'danger'
  stopNextObjectWatcher = watch(currentObjectId, () => {
    if (!stopNextObjectWatcher) return
    stopNextObjectWatcher()
    title.value = i18n.t('theLinker.chooseTarget')
    type.value = 'success'
    const fromObjectId = currentObjectId.map((objId) => objId).value as string

    const stopSecond = watch(currentObjectId, () => {
      stopSecond()
      const toObjectId = currentObjectId.map((objId) => objId).value as string
      title.value = i18n.t('theLinker.makeRelation')
      isClickLocked.value = false
      type.value = 'default'

      all([map, layer] as const).map(async ([vMap, vLayer]) => {
        vMap.objects[fromObjectId].arrows.push({ id: toObjectId })
        await updateObjectOnLayer(
          layerObjects,
          vLayer,
          vMap.objects[fromObjectId],
          vMap
        )
      })
    })
  })
}
</script>

<template>
  <BaseButton class="TheLinker" :type="type" @click="startRelation">
    {{ title }}
  </BaseButton>
</template>
