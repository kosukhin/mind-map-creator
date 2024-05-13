<script setup lang="ts">
import { useOverlay } from '@/app/useOverlay';

const props = defineProps({
  name: {
    type: String,
    required: true,
  },
});

const {
  isOpened, close, back, isBackPossible,
} = useOverlay(props.name);
</script>

<template>
  <Transition name="fade">
    <div v-if="isOpened" class="absolute rounded-main overflow-y-auto flex justify-center items-center top-0 left-0 bg-black/10 z-20 h-full w-full" @click="close">
      <div class="w-full relative flex flex-col max-w-[800px] max-h-[90%] bg-white p-3" @click.stop>
        <div
          v-if="isBackPossible"
          title="Назад"
          class="absolute text-white left-0 top-0 -ml-5 flex justify-center items-center bg-primary/70 hover:bg-primary-second/70 cursor-pointer w-5"
          @click="back"
        >
          &lt;
        </div>
        <div title="Закрыть" class="e2e-modal-close absolute text-white right-0 top-0 -mr-5 flex justify-center items-center bg-danger/70 hover:bg-danger-second/70 cursor-pointer w-5" @click="close">
          &times;
        </div>
        <div v-if="$slots.header" class="BaseModal-Header">
          <slot name="header" />
        </div>
        <div class="overflow-y-auto flex-grow">
          <slot />
        </div>
        <div v-if="$slots.footer" class="BaseModal-Footer">
          <slot name="footer" />
        </div>
      </div>
    </div>
  </Transition>
</template>
