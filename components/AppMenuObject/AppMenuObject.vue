<script lang="ts" setup>
import { ref } from '@vue/reactivity'
import { watch } from '@vue/runtime-core'
import {
  useSharedMap,
  useMoveToObject,
  useSharedOverlay,
  useOverlayAutoClose,
} from '~/composables'
import { SHOW_OBJECT_MENU } from '~/constants'
import { MapObject } from '~/entities'

useOverlayAutoClose(SHOW_OBJECT_MENU)

const { firstMapLoad, map } = useSharedMap()
const menuItems = ref<MapObject[]>([])
watch(
  firstMapLoad,
  () => {
    if (map.value) {
      menuItems.value = Object.values(map.value.objects)
        .filter((object) => {
          return object.inMenu
        })
        .sort((a, b) => a.menuOrder - b.menuOrder)
    }
  },
  {
    immediate: true,
  }
)

const { close } = useSharedOverlay()
const { scrollToObject } = useMoveToObject()
const selectMenuItem = (id: string) => {
  scrollToObject(id)
  close()
}
</script>

<template>
  <div class="AppMenuObject">
    <div v-if="!menuItems.length" class="AppMenuObject-Empty">
      {{ $t('appMenuObject.noItems') }}
    </div>
    <div v-else class="AppMenuObject-List">
      <a
        v-for="item in menuItems"
        :key="item.id"
        class="AppMenuObject-Item"
        href="#"
        @click.prevent="selectMenuItem(item.id)"
      >
        {{ item.additionalName ? item.additionalName : item.name }}
      </a>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@import 'AppMenuObject';
</style>
