<script lang="ts" setup>
import { computed, ref } from '@vue/reactivity'
import { watch } from '@vue/runtime-core'
import Konva from 'konva'
import flattenDeep from 'lodash/flattenDeep'
import { useI18n } from 'vue-i18n'
import BaseButton from '~/components/BaseButton/BaseButton.vue'
import {
  useLayer,
  useLocks,
  useMap,
  useMapObject,
} from '~/composables'
import { MapStructure } from '~/entities'
import { cloneObject } from '~/utils'

const { layer, layerObjects } = useLayer()
const i18n = useI18n()
const title = ref(i18n.t('theGrouper.group'))
const type = ref('default')
const isGrouping = computed(() => type.value === 'danger')
const { map } = useMap()
const { currentObjectId } = useMapObject()
let stopNextObjectWatcher: Function | null = null
const { isClickLocked } = useLocks()
const groups = new Set()
let transformer = new Konva.Group({})

function createSelection(nodes: any) {
  nodes.forEach((node: any) => {
    node.draggable(false)
    transformer.add(node)

    if (node instanceof Konva.Text) {
      node.fill('#f00')
    }
  })
}

function findNodes() {
  return flattenDeep(
    Array.from(groups).map((objectId) => {
      return layerObjects.get(objectId as string)
    }) as any
  )
}

const cloneGroup = () => {
  ;[...groups].forEach(async (objectId) => {
    if (map.value && layer.value) {
      const vObj = map.value.objects[objectId as string]
      await cloneObject(vObj, map.value, layer.value, layerObjects)
    }
  })
}

const stopWatcher = () => {
  if (!stopNextObjectWatcher) {
    return
  }
  stopNextObjectWatcher()
  stopNextObjectWatcher = null
  isClickLocked.value = false
  title.value = i18n.t('theGrouper.group')
  type.value = 'default'
  groups.clear()
}

const onClick = () => {
  transformer = new Konva.Group({
    draggable: true,
  })
  transformer.on('dragend', () => {
    const nodes = findNodes()

    if (map.value) {
      nodes.forEach((node) => {
        if (node instanceof Konva.Image) {
          const object = (map.value as MapStructure).objects[
            node.attrs.objectId
          ]
          object.position = [
            node.x() + transformer.x(),
            node.y() + transformer.y(),
          ]
        }
      })
    }
  })

  if (layer.value) {
    layer.value.add(transformer)
  }

  if (stopNextObjectWatcher) {
    stopWatcher()
    return
  }

  title.value = 'Отменить'
  type.value = 'danger'
  isClickLocked.value = true
  currentObjectId.value = undefined
  stopNextObjectWatcher = watch(currentObjectId, () => {
    if (!currentObjectId.value) {
      return
    }

    if (groups.has(currentObjectId.value)) {
      groups.delete(currentObjectId.value)
    } else {
      groups.add(currentObjectId.value)
    }

    const objects = findNodes()

    createSelection(objects)
    setTimeout(() => {
      currentObjectId.value = undefined
    })
  })
}
</script>

<template>
  <div v-if="isGrouping" key="grouper-panel" class="TheGrouper-Panel">
    <BaseButton type="primary" @click="cloneGroup">
      {{ $t('theGrouper.clone') }}
    </BaseButton>
  </div>
  <BaseButton :type="type" @click="onClick"> {{ title }} </BaseButton>
</template>
