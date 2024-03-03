<script setup lang="ts">
import { watch } from '@vue/runtime-core'
import { computed, ref } from '@vue/reactivity'
import { useMagicKeys } from '@vueuse/core'
import { useSharedOverlay } from '~/composables'

const props = defineProps({
  name: {
    type: String,
    required: true,
  },
  direction: {
    type: String,
    default: 'ltr',
    validator: (value: string) => ['ltr', 'rtl', 'ttb', 'btt'].includes(value),
  },
})

const classes = computed(() => ({
  BaseDrawer: true,
  [`BaseDrawer_Direction_${props.direction}`]: true,
}))

const { overlayName, tryToClose } = useSharedOverlay()
const close = () => {
  tryToClose.value = props.name as string
}
const isOpened = ref(false)
watch(overlayName, () => {
  if (overlayName.value) {
    isOpened.value = overlayName.value === props.name
  }
})
const { current } = useMagicKeys()
watch(current, () => {
  if (!isOpened.value) {
    return
  }

  if (current.has('escape')) {
    close()
  }
})
</script>

<template>
  <Transition name="fade">
    <div v-if="isOpened" :class="classes" @click="close">
      <div class="BaseDrawer-Inner" @click.stop>
        <div v-if="$slots.header">
          <slot name="header" class="BaseDrawer-Header" />
        </div>
        <div class="BaseDrawer-Content">
          <slot />
        </div>
        <div v-if="$slots.footer" class="BaseDrawer-Footer">
          <slot name="footer" />
        </div>
      </div>
    </div>
  </Transition>
</template>

<style scoped lang="scss">
@import 'BaseDrawer';
</style>
