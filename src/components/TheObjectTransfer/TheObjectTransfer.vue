<script lang="ts" setup>
import BaseButton from '@/components/BaseButton/BaseButton.vue';
import BaseModal from '@/components/BaseModal/BaseModal.vue';
import { useObjectActions } from '@/composables/useObjectActions';
import { useOverlayAutoClose } from '@/composables/useOverlayAutoclose';
import { useRequestTransfer } from '@/composables/useRequestTransfer';
import { useMapObject } from '@/composables/useMapObject';
import { useOverlay } from '@/composables/useOverlay';
import { SHOW_TRANSFER } from '@/constants/overlays';
import { HISTORY_STORAGE_KEY } from '@/constants/system';
import { MapObject } from '@/entities/Map';
import { createMapObjectUrl } from '@/utils/map';
import { ref } from '@vue/reactivity';
import { useStorage } from '@vueuse/core';
import BaseTextTitle from '@/components/BaseText/BaseTextTitle.vue';
import { mapOpened } from '@/domains/data/mapOpened';

useOverlayAutoClose(SHOW_TRANSFER);
const { currentObject } = useMapObject();
const map = mapOpened;
const linkedObjects = ref<any>([]);

const getObjectLink = (object: MapObject) => {
  if (object.outlink) {
    return object.outlink;
  }

  return createMapObjectUrl(object);
};

const { close } = useOverlay();
const { removeCurrentObject } = useObjectActions(false);
const { transferMap } = useRequestTransfer();
const transfer = (url: string, remove = true) => {
  if (currentObject.value && map.value) {
    transferMap(url, {
      object: currentObject.value,
      type: {
        ...map.value.types[currentObject.value.type],
        id: currentObject.value.type,
      },
    }).then(() => {
      if (remove) {
        removeCurrentObject();
      }
      close();
    });
  }
};

const mapsHistory = useStorage<{ url: string; title: string }[]>(
  HISTORY_STORAGE_KEY,
  [],
);
</script>

<template>
  <BaseModal :name="SHOW_TRANSFER">
    <template #header>
      <BaseTextTitle class="block">
        Перенести объект {{ currentObject?.name }}
        {{ currentObject?.additionalName }}
      </BaseTextTitle>
    </template>
    <ul class="TheObjectTransfer-Items">
      <li
        v-for="obj in linkedObjects"
        :key="obj.id"
        class="TheObjectTransfer-Item"
      >
        {{ obj.name }}
        {{ obj.additionalName ? `(${obj.additionalName})` : '' }}
        {{ getObjectLink(obj) }}
        <div class="flex gap-2">
          <BaseButton
            class="TheObjectTransfer-Button"
            type="danger"
            size="sm"
            @click="transfer(getObjectLink(obj))"
          >
            {{ $t('general.transfer') }}
          </BaseButton>
          <BaseButton
            class="TheObjectTransfer-Button"
            type="primary"
            size="sm"
            @click="transfer(getObjectLink(obj), false)"
          >
            {{ $t('general.copy') }}
          </BaseButton>
        </div>
      </li>
    </ul>
    <p>&nbsp;</p>
    <div>
      <h3>История переходов</h3>
      <p>&nbsp;</p>
      <ul class="TheObjectTransfer-Items">
        <li
          v-for="(obj, index) in mapsHistory"
          :key="index"
          class="TheObjectTransfer-Item"
        >
          {{ obj.title }} {{ obj.url }}
          <div class="flex gap-2">
            <BaseButton
              class="TheObjectTransfer-Button"
              type="danger"
              size="sm"
              @click="transfer(obj.url)"
            >
              {{ $t('general.transfer') }}
            </BaseButton>
            <BaseButton
              class="TheObjectTransfer-Button"
              type="primary"
              size="sm"
              @click="transfer(obj.url, false)"
            >
              {{ $t('general.copy') }}
            </BaseButton>
          </div>
        </li>
      </ul>
    </div>
  </BaseModal>
</template>
