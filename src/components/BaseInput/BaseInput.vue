<script lang="ts" setup>
import { defineEmits, defineProps } from '@vue/runtime-core';
import { useVModel } from '@vueuse/core';
import { ref } from '@vue/reactivity';
import { branchCombinator } from '@/modules/combinators/branchCombinator';
import partial from 'lodash/partial';
import { forms } from '@/modulesHigh/browser/forms';
import { onMounted } from 'vue';

const props = defineProps({
  modelValue: {
    type: [String, Number],
    default: '',
  },
  autofocus: {
    type: Boolean,
    default: false,
  },
});
const emit = defineEmits(['update:modelValue']);

const input = ref<HTMLInputElement | null>(null);
onMounted(() => {
  branchCombinator.when(
    props.autofocus,
    partial(forms.focus, input.value as HTMLElement),
  );
});

const data = useVModel(props, 'modelValue', emit);
</script>

<template>
  <input ref="input" v-model="data" class="block rounded-main w-full p-2 border border-solid border-body-dark" type="text" />
</template>
