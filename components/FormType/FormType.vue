<script lang="ts" setup>
import { computed, ref } from '@vue/reactivity'
import { watch } from '@vue/runtime-core'
import AppSvgEditor from '~/components/AppSvgEditor/AppSvgEditor.vue'
import BaseButton from '~/components/BaseButton/BaseButton.vue'
import BaseInput from '~/components/BaseInput/BaseInput.vue'
import BaseModal from '~/components/BaseModal/BaseModal.vue'
import {
  useFormDirtyCheck,
  useKeybindings,
  useMap,
  useMapType,
  useOverlay,
} from '~/composables'
import { SHOW_TYPE } from '~/constants'

const { stringify } = JSON

const form = ref<any>({})
const { currentTypeId, currentType } = useMapType()
const { map } = useMap()
watch(
  currentType,
  () => {
    if (currentType.value) {
      form.value = {
        ...currentType.value,
      }
    }
  },
  {
    flush: 'post',
    immediate: true,
  }
)
const isDirty = computed(
  () => stringify(form.value) !== stringify(currentType.value)
)
useFormDirtyCheck(isDirty, SHOW_TYPE)

const save = () => {
  close()
  if (map.value && currentTypeId.value) {
    map.value.types[currentTypeId.value] = {
      ...map.value.types[currentTypeId.value],
      ...form.value,
    }
  }
}

const { close, isOpened } = useOverlay()
const { ctrlSFired } = useKeybindings()
watch(ctrlSFired, () => {
  if (!isOpened(SHOW_TYPE)) {
    return
  }
  save()
})
</script>

<template>
  <BaseModal :name="SHOW_TYPE">
    <template #header>
      <h2>{{ $t('formType.mapType') }}</h2>
    </template>
    <div v-if="currentType" class="FormType">
      <BaseInput v-model="form.name" class="FormType-Row" />
      <AppSvgEditor v-model="form" />
    </div>
    <template #footer>
      <div class="FormType-Controls">
        <BaseButton type="success" @click="save">
          {{ $t('formType.save') }}
        </BaseButton>
        <BaseButton @click="close">
          {{ $t('formType.cancel') }}
        </BaseButton>
      </div>
    </template>
  </BaseModal>
</template>

<style lang="scss" scoped>
@import 'FormType';
</style>
