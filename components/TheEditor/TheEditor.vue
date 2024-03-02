<script setup lang="ts">
import { useMapRenderer } from '~/composables'
import { CANVAS_DOM_ID } from '~/constants'

useMapRenderer()
const counter = ref(0)

const { createLayer, layer, stage } = useSharedLayer()
onMounted(() => {
  if (layer.value) {
    layer.value.destroy()
  }

  if (stage.value) {
    stage.value.destroy()
  }

  // counter.value = Date.now()

  createLayer()
})
</script>

<template>
  <div :id="CANVAS_DOM_ID" :key="'editor-canvas' + counter"></div>
</template>
