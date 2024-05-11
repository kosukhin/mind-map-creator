<script lang="ts" setup>
import { useRouter } from '@/composables/useRouter';
import { jsonStringify } from '@/utils/jsonStringify';
import { onErrorCaptured, onMounted } from 'vue';
import { useRouter as useRealRouter } from 'vue-router';
import { useSessionLog } from '@/app/useSessionLog';
import { useMapFromURL } from '@/app/useMapFromURL';

const { sessionLog } = useSessionLog();
sessionLog('[App.vue]', 'init setup');

const router = useRouter();
const realRouter = useRealRouter();
router.realEffect.value = realRouter.push.bind(realRouter);

const { openMapFromURL } = useMapFromURL();
onMounted(openMapFromURL);

onErrorCaptured((e) => {
  sessionLog('[App.vue]', 'error captured', jsonStringify(e));
});
</script>

<template>
  <router-view/>
</template>
