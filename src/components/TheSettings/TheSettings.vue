<script lang="ts" setup>
import { computed, ref } from '@vue/reactivity';
import { watch } from '@vue/runtime-core';
import { useI18n } from 'vue-i18n';
import { omit } from 'lodash';
import BaseButton from '@/components/BaseButton/BaseButton.vue';
import BaseCheckbox from '@/components/BaseCheckbox/BaseCheckbox.vue';
import BaseInput from '@/components/BaseInput/BaseInput.vue';
import { MapSettings } from '@/entities/Map';
import { useOverlay } from '@/composables/useOverlay';
import { useKeybindings } from '@/composables/useKeybindings';
import {
  SHOW_JSON,
  SHOW_KEYBINDINGS,
  SHOW_PARENT_TYPES,
  SHOW_PRESETS,
  SHOW_SETTINGS,
} from '@/constants/overlays';
import { useFormDirtyCheck } from '@/composables/useFormDirtyCheck';
import { downloadFile } from '@/utils/dom';
import { createMapFileNameFromUrl } from '@/utils/map';
import { mapOpened } from '@/domains/data/mapOpened';
import { mapParentTypes } from '@/domains/data/mapParentTypes';
import { useMapActions } from '@/domains/composables/useMapActions';

const { stringify } = JSON;

const form = ref<Partial<MapSettings>>({});
const map = mapOpened;
const parentTypes = mapParentTypes;

const { close, overlayName, isOpened } = useOverlay();

const { mapRemove } = useMapActions();
const i18n = useI18n();
const onRemove = async () => {
  // eslint-disable-next-line no-restricted-globals
  if (confirm(i18n.t('general.notifications.thisWillTotallyRemoveMap'))) {
    mapRemove().then(close);
  }
};

const onSave = () => {
  close();
  if (map.value) {
    map.value.settings = { ...form.value } as MapSettings;
  }
};

const { ctrlSFired } = useKeybindings();
watch(ctrlSFired, () => {
  if (!isOpened(SHOW_SETTINGS)) {
    return;
  }
  onSave();
});

const isDirty = computed(
  () => stringify(omit(form.value, ['prevFavoriteGroup']))
    !== stringify(omit(map.value?.settings, ['prevFavoriteGroup'])),
);
useFormDirtyCheck(isDirty, SHOW_SETTINGS);

const onDownloadMap = () => {
  if (map.value) {
    downloadFile(createMapFileNameFromUrl(map.value), JSON.stringify(map.value));
  }
};
</script>

<template>
  <div class="TheSettings">
    <div class="mb-2">
      <a href="#" class="PageEditor-Download" @click.prevent="onDownloadMap">
        Скачать карту
      </a>
      <div class="TheSettings-Row">
        <div class="flex gap-2 mb-2">
          <BaseButton
            class="text-white"
            type="primary"
            @click="overlayName = SHOW_JSON"
          >
            {{ $t('general.jsonExportImport') }}
          </BaseButton>
          <BaseButton
            class="text-white"
            type="primary"
            @click="overlayName = SHOW_KEYBINDINGS"
          >
            {{ $t('general.keybindings') }}
          </BaseButton>
          <BaseButton
            v-if="parentTypes.length"
            type="primary"
            class="text-white"
            @click="overlayName = SHOW_PARENT_TYPES"
          >
            {{ $t('general.parentTypes') }}
          </BaseButton>
          <BaseButton
            type="primary"
            class="text-white e2e-open-presets"
            @click="overlayName = SHOW_PRESETS"
          >
            Пресеты
          </BaseButton>
        </div>
      </div>
      <div class="TheSettings-Row">
        <BaseCheckbox
          v-model="form.colored"
          :label="$t('general.useLabelsColoring')"
        />
      </div>
      <div class="mb-2">
        <BaseCheckbox
          v-model="form.skipSearchIndex"
          label="Пропустить индексацию поиском"
        />
      </div>
      <div class="mb-2">
        <label>
          <b>{{ $t('general.mapName') }}</b>
          <BaseInput v-model="form.title" />
        </label>
      </div>
      <div class="mb-2">
        <a href="https://github.com/kosukhin/mind-map-creator" target="_blank">
          {{ $t('general.githubRepo') }}
        </a>
      </div>
      <div class="mb-4">
        <b>{{ $t('general.favorites') }}</b>
        <BaseInput v-model="form.favoriteGroup" />
      </div>
    </div>
    <div class="flex gap-2">
      <BaseButton class="TheSettings-Button" type="success" @click="onSave">
        {{ $t('general.save') }}
      </BaseButton>
      <BaseButton class="TheSettings-Button" @click="close">
        {{ $t('general.cancel') }}
      </BaseButton>
      <BaseButton class="TheSettings-Button" type="danger" @click="onRemove">
        {{ $t('general.removeMap') }}
      </BaseButton>
    </div>
  </div>
</template>
