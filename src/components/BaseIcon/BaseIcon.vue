<script lang="ts" setup>
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import {
  faBars,
  faTextWidth,
  faFileText,
  faSearch,
  faRotateLeft,
  faRotateRight,
  faHistory,
  faPlusSquare,
  faCog,
  faMap,
  faClose,
  IconDefinition,
} from '@fortawesome/free-solid-svg-icons';

const icons: Record<string, IconDefinition> = {
  'fa-bars': faBars,
  'fa-text-width': faTextWidth,
  'fa-search': faSearch,
  'fa-history': faHistory,
  'fa-plus-square': faPlusSquare,
  'fa-cog': faCog,
  'fa-file-text': faFileText,
  'fa-rotate-left': faRotateLeft,
  'fa-rotate-right': faRotateRight,
  'fa-map': faMap,
  'fa-close': faClose,
};

defineProps({
  icon: {
    type: String,
  },
});
</script>

<template>
  <FontAwesomeIcon :icon="icons[icon]" />
</template>
