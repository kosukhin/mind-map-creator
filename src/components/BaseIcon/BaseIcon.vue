<script lang="ts" setup>
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import {
  faBars, faTextWidth, faSearch, faHistory, faPlusSquare, faCog,
} from '@fortawesome/free-solid-svg-icons';

const icons: Record<string, any> = {
  'fa-bars': faBars,
  'fa-text-width': faTextWidth,
  'fa-search': faSearch,
  'fa-history': faHistory,
  'fa-plus-square': faPlusSquare,
  'fa-cog': faCog,
};

defineProps({
  icon: {
    type: String,
  },
});
</script>

<template>
  <FontAwesomeIcon :icon="icons[icon as string]" />
</template>
