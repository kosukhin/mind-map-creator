<script setup lang="ts">
import AppMenuObject from '@/components/AppMenuObject/AppMenuObject.vue';
import AppPresets from '@/components/AppPresets/AppPresets.vue';
import AppSearch from '@/components/AppSearch/AppSearch.vue';
import AppSessionLog from '@/components/AppSessionLog/AppSessionLog.vue';
import AppTypesParent from '@/components/AppTypesParent/AppTypesParent.vue';
import BaseButton from '@/components/BaseButton/BaseButton.vue';
import BaseDrawer from '@/components/BaseDrawer/BaseDrawer.vue';
import BaseIcon from '@/components/BaseIcon/BaseIcon.vue';
import BaseModal from '@/components/BaseModal/BaseModal.vue';
import BaseNotify from '@/components/BaseNotify/BaseNotify.vue';
import BaseTextTitle from '@/components/BaseText/BaseTextTitle.vue';
import FastPreviewObject from '@/components/FastPreviewObject/FastPreviewObject.vue';
import FormJson from '@/components/FormJson/FormJson.vue';
import FormObject from '@/components/FormObject/FormObject.vue';
import FormType from '@/components/FormType/FormType.vue';
import TheEditor from '@/components/TheEditor/TheEditor.vue';
import TheHeader from '@/components/TheHeader/TheHeader.vue';
import TheHistoryMaps from '@/components/TheHistoryMaps/TheHistoryMaps.vue';
import TheKeybindings from '@/components/TheKeybindings/TheKeybindings.vue';
import TheMapAsText from '@/components/TheMapAsText/TheMapAsText.vue';
import TheMiniMap from '@/components/TheMiniMap/TheMiniMap.vue';
import TheObjectTransfer from '@/components/TheObjectTransfer/TheObjectTransfer.vue';
import TheSettings from '@/components/TheSettings/TheSettings.vue';
import TheSideBar from '@/components/TheSideBar/TheSideBar.vue';
import { useHashChange } from '@/composables/useHashChange';
import { useKeybindings } from '@/composables/useKeybindings';
import { useMapHistory } from '@/composables/useMapHistory';
import { useMeta } from '@/composables/useMeta';
import { useMoveToObject } from '@/composables/useMoveToObject';
import { useOverlay } from '@/composables/useOverlay';
import { useSideBar } from '@/composables/useSideBar';
import {
  SHOW_HISTORY_MAPS,
  SHOW_KEYBINDINGS,
  SHOW_OBJECT_MENU,
  SHOW_PARENT_TYPES,
  SHOW_PRESETS,
  SHOW_SEARCH,
  SHOW_SESSION_LOG,
  SHOW_SETTINGS,
} from '@/constants/overlays';
import { watch } from '@vue/runtime-core';
import { computed } from 'vue';

useMeta();

const { scrollToObject } = useMoveToObject();
const { hashChanged } = useHashChange();
watch(hashChanged, () => {
  if (hashChanged.value) {
    scrollToObject(hashChanged.value);
  }
});

const { overlayName } = useOverlay();
const { ctrlFFired, ctrlMFired, ctrlHFired } = useKeybindings();
watch(ctrlFFired, () => {
  overlayName.value = SHOW_SEARCH;
});
watch(ctrlMFired, () => {
  overlayName.value = SHOW_OBJECT_MENU;
});
watch(ctrlHFired, () => {
  overlayName.value = SHOW_HISTORY_MAPS;
});

const version = '0.1';
const { isSidebarOpen } = useSideBar();

const {
  history,
  canUndo,
  canRedo,
  undo,
  redo,
} = useMapHistory();
const historyFiltered = computed(() => history.value.map((h: any) => new Date(h.timestamp).toLocaleString()));
</script>

<template>
  <transition name="slide-fade">
    <div
      class="absolute bg-black/40 text-white h-full w-full z-10 flex items-center justify-center" v-if="isLoading">
      Карта загружается...
    </div>
  </transition>
  <div class="PageEditor-SideBarOpener" @click="isSidebarOpen = !isSidebarOpen">
    <hr />
    <hr />
    <hr />
  </div>
  <div class="grid grid-cols-[200px_1fr] grid-rows-[50px_1fr] h-dvh relative">
    <TheHeader class="col-span-2" />
    <TheSideBar />
    <TheEditor class="w-auto col-auto h-full " />
    <TheMiniMap />
  </div>
  <BaseNotify />
  <FormType />
  <BaseDrawer :name="SHOW_OBJECT_MENU" direction="rtl">
    <template #header>
      <h2 class="text-lg font-bold">{{ $t('general.menu') }}</h2>
    </template>
    <AppMenuObject />
  </BaseDrawer>
  <BaseModal :name="SHOW_KEYBINDINGS">
    <template #header>
      <BaseTextTitle class="block">
        {{ $t('general.keybindings') }}
      </BaseTextTitle>
    </template>
    <TheKeybindings />
  </BaseModal>
  <BaseModal :name="SHOW_PARENT_TYPES">
    <template #header>
      <h2 class="text-lg">{{ $t('general.parentTypes') }}</h2>
    </template>
    <AppTypesParent />
  </BaseModal>
  <TheMapAsText />
  <BaseModal :name="SHOW_SETTINGS">
    <template #header>
      <h2 class="text-lg font-bold">{{ $t('general.mapSettings') }}, {{ version }}</h2>
    </template>
    <TheSettings />
  </BaseModal>
  <BaseModal :name="SHOW_SEARCH">
    <template #header>
      <BaseTextTitle>
        {{ $t('general.mapSearch') }}
      </BaseTextTitle>
    </template>
    <AppSearch />
  </BaseModal>
  <BaseModal :name="SHOW_PRESETS">
    <template #header>
      <BaseTextTitle class="block">
        Пресеты узлов карт
      </BaseTextTitle>
    </template>
    <AppPresets />
  </BaseModal>
  <BaseDrawer direction="btt" :name="SHOW_SESSION_LOG">
    <div class="flex">
      <div class="flex-grow w-1/2">
        <BaseTextTitle>Логи сессии</BaseTextTitle>
        <AppSessionLog />
      </div>
      <div class="flex-grow w-1/2">
        <BaseTextTitle class="flex items-center gap-2 ">
          История изменений
          <BaseButton
            v-if="canUndo"
            size="sm"
            title="Отменить последнее действие"
            class="aspect-square"
            @click="undo"
          >
            <BaseIcon icon="fa-rotate-left" />
          </BaseButton>
          <BaseButton
            v-if="canRedo"
            size="sm"
            title="Вернуть отмененное действие"
            class="aspect-square"
            @click="redo"
          >
            <BaseIcon icon="fa-rotate-right" />
          </BaseButton>
        </BaseTextTitle>
        <div :key="changeDate" v-for="changeDate in historyFiltered">
          Изменение от {{ changeDate }}
        </div>
      </div>
    </div>
  </BaseDrawer>
  <FormJson />
  <FormObject />
  <FastPreviewObject />
  <TheHistoryMaps />
  <TheObjectTransfer />
</template>
