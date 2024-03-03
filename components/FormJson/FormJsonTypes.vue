<script lang="ts" setup>
import { computed, ref } from '@vue/reactivity'
import { nextTick, watch } from '@vue/runtime-core'
import merge from 'lodash/merge'
import { SHOW_JSON_TYPES } from '~/constants'
import {
  useFormDirtyCheck,
  useSharedMap,
  useSharedOverlay,
} from '~/composables'
import BaseModal from '~/components/BaseModal/BaseModal.vue'
import BaseTextarea from '~/components/BaseTextarea/BaseTextarea.vue'
import BaseButton from '~/components/BaseButton/BaseButton.vue'

const { stringify } = JSON

const { map } = useSharedMap()
const form = ref('')
watch(
  map,
  () => {
    if (map.value) {
      form.value = stringify(map.value.types)
    }
  },
  {
    immediate: true,
  }
)
const isDirty = computed(() => form.value !== stringify(map.value?.types))
useFormDirtyCheck(isDirty, SHOW_JSON_TYPES)

const onSave = () => {
  if (map.value) {
    map.value.types = merge(map.value.types, JSON.parse(form.value))
    nextTick().then(() => {
      location.reload()
    })
  }
}

const { close } = useSharedOverlay()
</script>

<template>
  <BaseModal :name="SHOW_JSON_TYPES">
    <template #header>
      <h2>
        {{ $t('formJsonTypes.exportOrImport') }}
      </h2>
    </template>
    <div class="FormJson">
      <BaseTextarea v-model="form" class="FormJson-Text" />
    </div>
    <template #footer>
      <div class="FormJson-Buttons">
        <BaseButton class="FormJson-Button" type="success" @click="onSave">
          {{ $t('formJsonTypes.save') }}
        </BaseButton>
        <BaseButton class="FormJson-Button" @click="close">{{
          $t('formJsonTypes.cancel')
        }}</BaseButton>
      </div>
    </template>
  </BaseModal>
</template>

<style scoped lang="scss">
@import 'FormJson';
</style>
