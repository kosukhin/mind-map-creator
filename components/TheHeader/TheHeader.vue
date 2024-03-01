<script setup lang="ts">
import { useCssVar } from '@vueuse/core'
import { ref } from '@vue/reactivity'
import { watch } from '@vue/runtime-core'
import { useSharedMap, useSharedOverlay } from '~/composables'
import {
  SHOW_TEXT,
  SHOW_SEARCH,
  SHOW_OBJECT_MENU,
  SHOW_HISTORY_MAPS,
} from '~/constants'
import BaseIcon from '~/components/BaseIcon/BaseIcon.vue'
import BaseBreadcrumbs from '@/components/BaseBreadcrumbs/BaseBreadcrumbs.vue'
import BaseButton from '@/components/BaseButton/BaseButton.vue'
import { calculateProgressBg } from '~/utils'

const { overlayName } = useSharedOverlay()
const { firstMapLoad, map } = useSharedMap()

const progressElement = ref(null)
const progress = useCssVar('--progress', progressElement)
const progressColor = useCssVar('--progressColor', progressElement)
watch(firstMapLoad, () => {
  map.map((vMap) => {
    const progressNumber = (vMap.progress < 100 ? vMap.progress : 100) / 100
    progress.value = `${vMap.progress}%`
    const color = calculateProgressBg(progressNumber)
    progressColor.value = `rgba(${color.r}, ${color.g}, ${color.b}, ${color.a})`
  })
})
</script>

<template>
  <div class="TheHeader">
    <BaseBreadcrumbs class="TheHeader-Breadcrumbs" />
    <div class="TheHeader-Actions">
      <BaseButton
        type="success"
        size="sm"
        :title="$t('theHeader.menu')"
        @click="overlayName.value = SHOW_OBJECT_MENU"
      >
        <BaseIcon icon="fa-bars" />
      </BaseButton>
      <BaseButton
        :title="$t('theHeader.byText')"
        type="primary"
        size="sm"
        @click="overlayName.value = SHOW_TEXT"
      >
        <BaseIcon icon="fa-text-width" />
      </BaseButton>
      <BaseButton size="sm" @click="overlayName.value = SHOW_SEARCH">
        <BaseIcon icon="fa-search" />
      </BaseButton>
      <BaseButton
        size="sm"
        :title="$t('theHeader.visitHistory')"
        @click="overlayName.value = SHOW_HISTORY_MAPS"
      >
        <BaseIcon icon="fa-history" />
      </BaseButton>
    </div>
  </div>
</template>

<style scoped lang="scss">
@import 'TheHeader';
</style>
