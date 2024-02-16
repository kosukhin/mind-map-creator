<script setup lang="ts">
import { watch } from '@vue/runtime-core'
import { useRuntimeConfig } from '#app/nuxt'
import {
  SHOW_SETTINGS,
  SHOW_SEARCH,
  SHOW_PARENT_TYPES,
  SHOW_KEYBINDINGS,
  SHOW_OBJECT_MENU,
  SHOW_HISTORY_MAPS,
} from '~/constants'
import {
  useSharedLocks,
  useSharedSideBar,
  useSharedHashChange,
  useMoveToObject,
  useSharedKeybindings,
  useSharedOverlay,
  useSharedMeta,
} from '~/composables'
import TheHeader from '@/components/TheHeader/TheHeader.vue'
import TheEditor from '@/components/TheEditor/TheEditor.vue'
import TheSideBar from '@/components/TheSideBar/TheSideBar.vue'
import TheMiniMap from '@/components/TheMiniMap/TheMiniMap.vue'
import BaseNotify from '~/components/BaseNotify/BaseNotify.vue'
import FormType from '~/components/FormType/FormType.vue'
import FormObject from '~/components/FormObject/FormObject.vue'
import BaseModal from '~/components/BaseModal/BaseModal.vue'
import TheMapAsText from '~/components/TheMapAsText/TheMapAsText.vue'
import TheSettings from '~/components/TheSettings/TheSettings.vue'
import AppSearch from '~/components/AppSearch/AppSearch.vue'
import FormJson from '~/components/FormJson/FormJson.vue'
import AppTypesParent from '~/components/AppTypesParent/AppTypesParent.vue'
import TheKeybindings from '~/components/TheKeybindings/TheKeybindings.vue'
import AppMenuObject from '~/components/AppMenuObject/AppMenuObject.vue'
import BaseDrawer from '~/components/BaseDrawer/BaseDrawer.vue'
import TheHistoryMaps from '~/components/TheHistoryMaps/TheHistoryMaps.vue'
import TheObjectTransfer from '~/components/TheObjectTransfer/TheObjectTransfer.vue'

useSharedMeta()

const { scrollToObject } = useMoveToObject()
const { hashChanged } = useSharedHashChange()
watch(hashChanged, () => {
  hashChanged.map((vHash) => {
    if (!vHash) {
      return
    }
    scrollToObject(vHash)
  })
})

const { overlayName } = useSharedOverlay()
const { ctrlFFired, ctrlMFired, ctrlHFired } = useSharedKeybindings()
watch(ctrlFFired, () => {
  overlayName.value = SHOW_SEARCH
})
watch(ctrlMFired, () => {
  overlayName.value = SHOW_OBJECT_MENU
})
watch(ctrlHFired, () => {
  overlayName.value = SHOW_HISTORY_MAPS
})

const { isDragLocked } = useSharedLocks()
const handleLock = () => {
  isDragLocked.value = !isDragLocked.value
  setTimeout(() => location.reload())
}

const { version } = useRuntimeConfig()
const { isSidebarOpen } = useSharedSideBar()
</script>

<template>
  <div
    class="PageEditor-SelectionLocker"
    :class="{ 'PageEditor-SelectionLocker_Locked': isDragLocked }"
    @click="handleLock"
  >
    <div v-if="!isDragLocked" class="opened">&#128275;</div>
    <div v-if="isDragLocked" class="closed">&#128274;</div>
  </div>
  <div class="PageEditor-SideBarOpener" @click="isSidebarOpen = !isSidebarOpen">
    <hr />
    <hr />
    <hr />
  </div>
  <div class="PageEditor">
    <TheHeader class="PageEditor-Header" />
    <TheSideBar :class="['PageEditor-SideBar', { opened: isSidebarOpen }]" />
    <TheEditor class="PageEditor-Editor" />
    <TheMiniMap class="PageEditor-MiniMap" />
  </div>
  <BaseNotify />
  <FormType />
  <BaseDrawer :name="SHOW_OBJECT_MENU" direction="rtl">
    <template #header>
      <h2>{{ $t('pageEditor.menu') }}</h2>
    </template>
    <AppMenuObject />
  </BaseDrawer>
  <BaseModal :name="SHOW_KEYBINDINGS">
    <template #header>
      <h2>{{ $t('pageEditor.keybindings') }}</h2>
    </template>
    <TheKeybindings />
  </BaseModal>
  <BaseModal :name="SHOW_PARENT_TYPES">
    <template #header>
      <h2>{{ $t('pageEditor.parentTypes') }}</h2>
    </template>
    <AppTypesParent />
  </BaseModal>
  <TheMapAsText />
  <BaseModal :name="SHOW_SETTINGS">
    <template #header>
      <h2>{{ $t('pageEditor.mapSettings') }}, {{ version }}</h2>
    </template>
    <TheSettings />
  </BaseModal>
  <BaseModal :name="SHOW_SEARCH">
    <template #header>
      <h2>{{ $t('pageEditor.mapSearch') }}</h2>
    </template>
    <AppSearch />
  </BaseModal>
  <FormJson />
  <FormObject />
  <TheHistoryMaps />
  <TheObjectTransfer />
</template>

<style scoped lang="scss">
@import 'PageEditor';
</style>
