<script setup lang="ts">
import { watch } from '@vue/runtime-core'
import { ref } from '@vue/reactivity'
import { useMagicKeys } from '@vueuse/core'
import { useOverlay } from '~/composables'

const props = defineProps({
  name: {
    type: String,
    required: true,
  },
})

const isOpened = ref(false)
const { overlayName, tryToClose, history } = useOverlay()
const close = () => {
  tryToClose.value = props.name as string
}
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
const back = () => {
  history.value.pop()
  overlayName.value = String(history.value.pop())
}
</script>

<template>
  <Transition name="fade">
    <div v-if="isOpened" class="BaseModal" @click="close">
      <div class="BaseModal-Inner" @click.stop>
        <div
          v-if="history.length > 1"
          title="Назад"
          class="BaseModal-Back"
          @click="back"
        >
          &lt;
        </div>
        <div title="Закрыть" class="BaseModal-Close" @click="close">
          &times;
        </div>
        <div v-if="$slots.header" class="BaseModal-Header">
          <slot name="header" />
        </div>
        <div class="BaseModal-Content">
          <slot />
        </div>
        <div v-if="$slots.footer" class="BaseModal-Footer">
          <slot name="footer" />
        </div>
      </div>
    </div>
  </Transition>
</template>

<style scoped lang="scss">
@import 'BaseModal';
</style>
