<script lang="ts" setup>
import { useOverlayAutoClose } from '@/composables/useOverlayAutoclose';
import { SHOW_SESSION_LOG } from '@/constants/overlays';
import { useSessionLog } from '@/composables/useSessionLog';

useOverlayAutoClose(SHOW_SESSION_LOG);
const { sessionMessages, sessionLog } = useSessionLog();

sessionLog('[AppSessionLog.vue]', 'setup');
</script>

<template>
  <div class="overflow-y-auto">
    <div v-for="(message, index) in sessionMessages" :key="index" class="text-sm">
      {{message}}
    </div>
  </div>
</template>
