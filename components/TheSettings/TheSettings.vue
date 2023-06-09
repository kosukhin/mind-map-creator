<script lang="ts" setup>
import { computed, ref } from '@vue/reactivity'
import { watch } from '@vue/runtime-core'
import { useI18n } from 'vue-i18n'
import {
  SHOW_SETTINGS,
  SHOW_JSON,
  SHOW_PARENT_TYPES,
  SHOW_KEYBINDINGS,
} from '~/constants'
import {
  useSharedKeybindings,
  useSharedMap,
  useSharedOverlay,
  useRequestRemoveMap,
  useFormDirtyCheck,
} from '~/composables'
import { MapSettings } from '~/entities'
import BaseButton from '~/components/BaseButton/BaseButton.vue'
import BaseCheckbox from '~/components/BaseCheckbox/BaseCheckbox.vue'
import BaseInput from '~/components/BaseInput/BaseInput.vue'

const { stringify } = JSON

const form = ref({})
const { map, mapName, firstMapLoad, parentTypes } = useSharedMap()
watch(
  firstMapLoad,
  () => {
    map.map((vMap) => {
      form.value = { ...vMap.settings }
    })
  },
  {
    immediate: true,
  }
)

const i18n = useI18n()
const { removeMap } = useRequestRemoveMap()
const onRemove = async () => {
  if (confirm(i18n.t('theSettings.notifications.thisWillTotallyRemoveMap'))) {
    await removeMap(mapName)
    location.href = '/'
  }
}

const { close, overlayName, isOpened } = useSharedOverlay()
const onSave = () => {
  close()
  map.map((vMap) => {
    vMap.settings = { ...form.value } as MapSettings
  })
}

const { ctrlSFired } = useSharedKeybindings()
watch(ctrlSFired, () => {
  if (!isOpened(SHOW_SETTINGS)) {
    return
  }
  onSave()
})

const isDirty = computed(
  () =>
    stringify(form.value) !== stringify(map.map((vMap) => vMap.settings).value)
)
useFormDirtyCheck(isDirty, SHOW_SETTINGS)
</script>

<template>
  <div class="TheSettings">
    <div class="TheSettings-Content">
      <div class="TheSettings-Row">
        <div class="TheSettings-ButtonGroup">
          <BaseButton
            class="TheSettings-Button"
            type="primary"
            @click="overlayName.value = SHOW_JSON"
          >
            {{ $t('theSettings.jsonExportImport') }}
          </BaseButton>
          <BaseButton
            class="TheSettings-Button"
            type="primary"
            @click="overlayName.value = SHOW_KEYBINDINGS"
          >
            {{ $t('theSettings.keybindings') }}
          </BaseButton>
          <BaseButton
            v-if="parentTypes.length"
            type="primary"
            class="TheSettings-Button"
            @click="overlayName.value = SHOW_PARENT_TYPES"
          >
            {{ $t('theSettings.parentTypes') }}
          </BaseButton>
        </div>
      </div>
      <div class="TheSettings-Row">
        <BaseCheckbox
          v-model="form.colored"
          :label="$t('theSettings.useLabelsColoring')"
        />
      </div>
      <div class="TheSettings-Row">
        <label>
          <b>{{ $t('theSettings.mapName') }}</b>
          <BaseInput v-model="form.title" />
        </label>
      </div>
      <div class="TheSettings-Row">
        <a href="https://github.com/kosukhin/mind-map-creator" target="_blank">
          {{ $t('theSettings.githubRepo') }}
        </a>
      </div>
    </div>
    <div class="TheSettings-ButtonGroup">
      <BaseButton class="TheSettings-Button" type="success" @click="onSave">
        {{ $t('theSettings.save') }}
      </BaseButton>
      <BaseButton class="TheSettings-Button" @click="close">
        {{ $t('theSettings.cancel') }}
      </BaseButton>
      <BaseButton class="TheSettings-Button" type="danger" @click="onRemove">
        {{ $t('theSettings.removeMap') }}
      </BaseButton>
    </div>
  </div>
</template>

<style scoped lang="scss">
@import 'TheSettings';
</style>
