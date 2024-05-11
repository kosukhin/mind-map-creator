<script lang="ts" setup>
import { SHOW_SESSION_LOG } from '@/constants/overlays';
import { overlayController } from '@/modulesHigh/overlay/overlayController';
import { useSessionLog } from '@/app/useSessionLog';

overlayController.autoClose(SHOW_SESSION_LOG);

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
