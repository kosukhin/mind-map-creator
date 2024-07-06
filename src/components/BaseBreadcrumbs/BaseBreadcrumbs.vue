<script lang="ts" setup>
import uniqueId from 'lodash/uniqueId';
import { mapOpened } from '@/domains/data/mapOpened';

const map = mapOpened.value();
</script>

<template>
  <div>
    <span
      v-for="(title, url) in map?.parentNames"
      :key="url || uniqueId('history_')"
    >
      /
      <RouterLink :to="url">
        {{ title }}
      </RouterLink>
    </span>
    <span>
      /
      {{ map?.settings.title }}
    </span>
  </div>
</template>
