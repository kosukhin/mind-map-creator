<script lang="ts">
import { watch } from '@vue/runtime-core';
import { computed } from '@vue/reactivity';
import { useMagicKeys } from '@vueuse/core';
import { useOverlay } from '@/composables/useOverlay';
import { useState } from '@/composables/useState';
import { lensName } from '@/utils/lensName';
import { isTruthy } from '@/utils/isTruthy';
import { lensValue } from '@/utils/lensValue';
import { defineComponent } from 'vue';
import {
  always, and, applyTo, converge, equals, identity, includes, pipe, view, when,
} from 'ramda';

const withDirections = applyTo(['ltr', 'rtl', 'ttb', 'btt']);
export default defineComponent({
  name: 'BaseDrawer',
  props: {
    name: {
      type: String,
      required: true,
    },
    direction: {
      type: String,
      default: 'ltr',
      validator: (value: string) => withDirections(includes(value)),
    },
  },
  setup(props) {
    const classes = computed(always(['absolute z-10 top-0 left-0 w-full h-full bg-black/50']));
    const positions = {
      ltr: 'top-0 left-0 w-[50%] max-w-[900px] ',
      rtl: 'top-0 right-0 w-[50%] max-w-[900px] ',
      ttb: 'top-0 right-0 left-0',
      btt: 'top-auto h-[900px] max-h-[50%] bottom-0 right-0 left-0',
    };

    const { overlayName, setTryToClose, withOverlayName } = useOverlay();
    const withProps = applyTo(props);

    const nameProp = view(lensName);
    const close = () => withProps(pipe(nameProp, setTryToClose));

    const [isOpened, setIsOpened] = useState(false);
    const withIsOpened = applyTo(isOpened);

    const overlayIsOpenedCalculation = pipe(
      view(lensValue),
      when(
        isTruthy,
        converge(equals, [() => withProps(nameProp), identity]),
      ),
    );
    watch(overlayName, () => withOverlayName(
      pipe(overlayIsOpenedCalculation, setIsOpened),
    ));

    const { current } = useMagicKeys();
    watch(current, () => withIsOpened(pipe(
      view(lensValue),
      when(pipe(isTruthy, and(current.has('escape'))), close),
    )));

    return {
      isOpened,
      classes,
      positions,
    };
  },
});

</script>

<template>
  <Transition name="fade">
    <div v-if="isOpened" :class="classes" @click="close">
      <div class="absolute bg-white h-full p-3 flex flex-col overflow-hidden" :class="positions[direction]" @click.stop>
        <div v-if="$slots.header">
          <slot name="header" class="BaseDrawer-Header" />
        </div>
        <div class="flex-grow overflow-y-auto">
          <slot />
        </div>
        <div v-if="$slots.footer" class="flex gap-1">
          <slot name="footer" />
        </div>
      </div>
    </div>
  </Transition>
</template>
