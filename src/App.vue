<script lang="ts" setup>
import { useRouter } from '@/composables/useRouter';
import { jsonStringify } from '@/utils/jsonStringify';
import { onErrorCaptured, onMounted } from 'vue';
import { useRoute, useRouter as useRealRouter } from 'vue-router';
import { useSessionLog } from '@/composables/useSessionLog';
import { useOpenFile } from '@/composables/useOpenFile';

const { sessionLog } = useSessionLog();
sessionLog('[App.vue]', 'init setup');

const router = useRouter();
const realRouter = useRealRouter();
router.realEffect.value = realRouter.push.bind(realRouter);

const route = useRoute();
const { forceFile } = useOpenFile();
onMounted(() => {
  setTimeout(() => {
    if (route.query.view) {
      fetch(route.query.view as string)
        .then((r) => r.text())
        .then((r) => {
          forceFile.value = new File([r], 'current');
          router.push('/current');
        });
    }
  }, 0);
});

onErrorCaptured((e) => {
  sessionLog('[App.vue]', 'error captured', jsonStringify(e));
});
</script>

<template>
  <router-view/>
</template>
