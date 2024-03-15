<script lang="ts" setup>
import { useNotify } from '~/composables'

const { message } = useNotify()
</script>

<template>
  <div v-if="message" :class="['BaseNotify', `BaseNotify_theme_${message[1]}`]">
    {{ message[0] }}
  </div>
</template>

<style scoped lang="scss">
@import 'BaseNotify';
</style>
