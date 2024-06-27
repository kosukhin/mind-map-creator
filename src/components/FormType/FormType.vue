<script lang="ts" setup>
import { computed, ref } from '@vue/reactivity';
import { watch } from '@vue/runtime-core';
import BaseButton from '@/components/BaseButton/BaseButton.vue';
import BaseInput from '@/components/BaseInput/BaseInput.vue';
import BaseModal from '@/components/BaseModal/BaseModal.vue';
import { useMapType } from '@/composables/useMapType';
import { useMap } from '@/composables/useMap';
import { SHOW_TYPE } from '@/constants/overlays';
import { useFormDirtyCheck } from '@/composables/useFormDirtyCheck';
import { useOverlay } from '@/composables/useOverlay';
import { useKeybindings } from '@/composables/useKeybindings';
import BaseTextarea from '@/components/BaseTextarea/BaseTextarea.vue';
import BaseInputTitle from '@/components/BaseInputTitle/BaseInputTitle.vue';
import BaseInputRow from '@/components/BaseInput/BaseInputRow.vue';

const { stringify } = JSON;

const form = ref<any>({});
const { currentTypeId, currentType } = useMapType();
const { map } = useMap();
watch(
  currentType,
  () => {
    if (currentType.value) {
      form.value = {
        ...currentType.value,
      };
    }
  },
  {
    flush: 'post',
    immediate: true,
  },
);
const isDirty = computed(
  () => stringify(form.value) !== stringify(currentType.value),
);
useFormDirtyCheck(isDirty, SHOW_TYPE);

const { close, isOpened } = useOverlay();

const save = () => {
  close();
  if (map.value && currentTypeId.value) {
    map.value.types[currentTypeId.value] = {
      ...map.value.types[currentTypeId.value],
      ...form.value,
    };
  }
};
const { ctrlSFired } = useKeybindings();
watch(ctrlSFired, () => {
  if (!isOpened(SHOW_TYPE)) {
    return;
  }
  save();
});
</script>

<template>
  <BaseModal :name="SHOW_TYPE">
    <template #header>
      <h2 class="text-lg font-bold">{{ $t('general.mapType') }}</h2>
    </template>
    <div v-if="currentType" class="flex flex-col">
      <BaseInputRow>
        <BaseInputTitle>
          Название типа
        </BaseInputTitle>
        <BaseInput v-model="form.name" />
      </BaseInputRow>
      <BaseInputRow>
        <BaseInputTitle>
          Разметка HTML
        </BaseInputTitle>
        <BaseTextarea v-model="form.svg" />
      </BaseInputRow>
      <BaseInputRow>
        <BaseInputTitle>
          Ширина
        </BaseInputTitle>
        <BaseInput v-model="form.width" />
      </BaseInputRow>
      <BaseInputRow>
        <BaseInputTitle>
          Высота
        </BaseInputTitle>
        <BaseInput v-model="form.height" />
      </BaseInputRow>
    </div>
    <template #footer>
      <div class="flex justify-end pt-4 gap-2">
        <BaseButton type="success" @click="save">
          {{ $t('general.save') }}
        </BaseButton>
        <BaseButton @click="close">
          {{ $t('general.cancel') }}
        </BaseButton>
      </div>
    </template>
  </BaseModal>
</template>
