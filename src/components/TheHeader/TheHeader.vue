<script setup lang="ts">
import BaseBreadcrumbs from '@/components/BaseBreadcrumbs/BaseBreadcrumbs.vue';
import BaseButton from '@/components/BaseButton/BaseButton.vue';
import BaseIcon from '@/components/BaseIcon/BaseIcon.vue';
import { useOverlay } from '@/composables/useOverlay';
import {
  SHOW_HISTORY_MAPS,
  SHOW_OBJECT_MENU,
  SHOW_SEARCH,
  SHOW_SESSION_LOG,
  SHOW_TEXT,
} from '@/constants/overlays';
import { useMapHistory } from '@/composables/useMapHistory';

const { overlayName } = useOverlay();
const {
  undo, redo, canUndo, canRedo,
} = useMapHistory();
</script>

<template>
  <div class="flex items-center p-3 gap-3">
    <img src="/icon-top-bar.png" width="57" height="42" alt="mmc" />
    <BaseBreadcrumbs class="TheHeader-Breadcrumbs" />
    <div class="ml-auto gap-1 flex">
      <BaseButton
        v-if="canUndo"
        size="sm"
        title="Отменить последнее действие"
        class="w-7 block"
        @click="undo"
      >
        <BaseIcon icon="fa-rotate-left" />
      </BaseButton>
      <BaseButton
        v-if="canRedo"
        size="sm"
        title="Вернуть отмененное действие"
        class="w-7 block"
        @click="redo"
      >
        <BaseIcon icon="fa-rotate-right" />
      </BaseButton>
      <BaseButton
        type="success"
        size="sm"
        title="Показать лог сессии"
        class="w-7 block e2e-session-open"
        @click="overlayName = SHOW_SESSION_LOG"
      >
        <BaseIcon icon="fa-file-text" />
      </BaseButton>
      <BaseButton
        type="success"
        size="sm"
        class="w-7 block e2e-open-menu"
        :title="$t('general.menu')"
        @click="overlayName = SHOW_OBJECT_MENU"
      >
        <BaseIcon icon="fa-bars" />
      </BaseButton>
      <BaseButton
        :title="$t('general.byText')"
        type="primary"
        size="sm"
        class="w-7 block"
        @click="overlayName = SHOW_TEXT"
      >
        <BaseIcon icon="fa-text-width" />
      </BaseButton>
      <BaseButton
        class="w-7 block e2e-search"
        size="sm"
        @click="overlayName = SHOW_SEARCH"
      >
        <BaseIcon icon="fa-search" />
      </BaseButton>
      <BaseButton
        size="sm"
        :title="$t('general.visitHistory')"
        @click="overlayName = SHOW_HISTORY_MAPS"
        class="w-7 block"
      >
        <BaseIcon icon="fa-history" />
      </BaseButton>
    </div>
  </div>
</template>
