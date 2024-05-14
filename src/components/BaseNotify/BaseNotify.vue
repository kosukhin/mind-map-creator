<script lang="ts" setup>
import { useNotify } from '@/app/useNotify';

const { message } = useNotify();
</script>

<template>
  <div v-if="message" :class="['fixed bottom-3 right-[50%] translate-x-[50%] p-3 rounded', `bg-${message[1]}`]">
    {{ message[0] }}
  </div>
</template>
