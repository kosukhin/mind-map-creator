<script lang="ts" setup>
import { notificationMessage } from '@/domains/data/notificationMessage';
</script>

<template>
  <div v-if="notificationMessage" :class="['fixed bottom-3 right-[50%] translate-x-[50%] p-3 rounded', `bg-${notificationMessage[1]}`]">
    {{ notificationMessage[0] }}
  </div>
</template>
