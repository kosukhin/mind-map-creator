<script lang="ts" setup>
import { useStorage, watchOnce } from '@vueuse/core'
import { ref } from '@vue/reactivity'
import { HISTORY_STORAGE_KEY, SHOW_TRANSFER } from '~/constants'
import {
  useObjectActions,
  useOverlayAutoClose,
  useSharedMap,
  useSharedMapObject,
  useSharedOverlay,
} from '~/composables'
import BaseButton from '~/components/BaseButton/BaseButton.vue'
import { all, createMapObjectUrl } from '~/utils'
import { useRequestTransfer } from '~/composables/useRequestTransfer'

useOverlayAutoClose(SHOW_TRANSFER)
const { currentObject } = useSharedMapObject()
const { map, firstMapLoad } = useSharedMap()
const linkedObjects = ref([])

watchOnce(firstMapLoad, () => {
  map.map((vMap) => {
    linkedObjects.value = Object.values(vMap.objects).filter(
      (item) => item.linked
    )
  })
})

const getObjectLink = (object) => {
  if (object.outlink) {
    return object.outlink
  }

  return createMapObjectUrl(object)
}

const { close } = useSharedOverlay()
const { removeCurrentObject } = useObjectActions(false)
const { transferMap } = useRequestTransfer()
const transfer = (url, remove = true) => {
  all([currentObject, map] as const).map(async ([vCurObj, vMap]) => {
    await transferMap(url, {
      object: vCurObj,
      type: { ...vMap.types[vCurObj.type], id: vCurObj.type },
    })
    if (remove) {
      removeCurrentObject()
    }
    close()
  })
}

const mapsHistory = useStorage<{ url: string; title: string }[]>(
  HISTORY_STORAGE_KEY,
  []
)
</script>

<template>
  <BaseModal :name="SHOW_TRANSFER">
    <template #header>
      <h2>
        Перенести объект {{ currentObject.value.name }}
        {{ currentObject.value.additionalName }}
      </h2>
    </template>
    <ul class="TheObjectTransfer-Items">
      <li
        v-for="obj in linkedObjects"
        :key="obj.id"
        class="TheObjectTransfer-Item"
      >
        {{ obj.name }}
        {{ obj.additionalName ? `(${obj.additionalName})` : '' }}
        {{ getObjectLink(obj) }}
        <BaseButton
          class="TheObjectTransfer-Button"
          type="danger"
          size="sm"
          @click="transfer(getObjectLink(obj))"
        >
          {{ $t('theObjectTransfer.transfer') }}
        </BaseButton>
        <BaseButton
          class="TheObjectTransfer-Button"
          type="primary"
          size="sm"
          @click="transfer(getObjectLink(obj), false)"
        >
          {{ $t('theObjectTransfer.copy') }}
        </BaseButton>
      </li>
    </ul>
    <p>&nbsp;</p>
    <div>
      <h3>История переходов</h3>
      <p>&nbsp;</p>
      <ul class="TheObjectTransfer-Items">
        <li
          v-for="(obj, index) in mapsHistory"
          :key="index"
          class="TheObjectTransfer-Item"
        >
          {{ obj.title }} {{ obj.url }}
          <BaseButton
            class="TheObjectTransfer-Button"
            type="danger"
            size="sm"
            @click="transfer(obj.url)"
          >
            {{ $t('theObjectTransfer.transfer') }}
          </BaseButton>
          <BaseButton
            class="TheObjectTransfer-Button"
            type="primary"
            size="sm"
            @click="transfer(obj.url, false)"
          >
            {{ $t('theObjectTransfer.copy') }}
          </BaseButton>
        </li>
      </ul>
    </div>
  </BaseModal>
</template>

<style lang="scss" scoped>
@import './TheObjectTransfer';
</style>
