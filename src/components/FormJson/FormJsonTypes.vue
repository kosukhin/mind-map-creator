<script lang="ts" setup>
import { computed, ref } from '@vue/reactivity';
import { nextTick, watch } from '@vue/runtime-core';
import merge from 'lodash/merge';
import BaseModal from '@/components/BaseModal/BaseModal.vue';
import BaseTextarea from '@/components/BaseTextarea/BaseTextarea.vue';
import BaseButton from '@/components/BaseButton/BaseButton.vue';
import { useFormDirtyCheck } from '@/composables/useFormDirtyCheck';
import { SHOW_JSON_TYPES } from '@/constants/overlays';
import { getLocation } from '@/utils/globals';
import { useOverlay } from '@/composables/useOverlay';
import BaseTextTitle from '@/components/BaseText/BaseTextTitle.vue';
import { mapOpened } from '@/domains/data/mapOpened';

const { stringify } = JSON;

const map = mapOpened.value();
const form = ref('');
watch(
  map,
  () => {
    if (map.value) {
      form.value = stringify(map.value.types);
    }
  },
  {
    immediate: true,
  },
);
const isDirty = computed(() => form.value !== stringify(map.value?.types));
useFormDirtyCheck(isDirty, SHOW_JSON_TYPES);

const onSave = () => {
  if (map.value) {
    map.value.types = merge(map.value.types, JSON.parse(form.value));
    nextTick().then(() => {
      getLocation().reload();
    });
  }
};

const { close } = useOverlay();
</script>

<template>
  <BaseModal :name="SHOW_JSON_TYPES">
    <template #header>
      <BaseTextTitle>
        {{ $t('formJsonTypes.exportOrImport') }}
      </BaseTextTitle>
    </template>
    <div class="mb-3">
      <BaseTextarea v-model="form" class="FormJson-Text" />
    </div>
    <template #footer>
      <div class="flex gap-2">
        <BaseButton type="success" @click="onSave">
          {{ $t('general.save') }}
        </BaseButton>
        <BaseButton @click="close">
          {{ $t('general.cancel') }}
        </BaseButton>
      </div>
    </template>
  </BaseModal>
</template>
