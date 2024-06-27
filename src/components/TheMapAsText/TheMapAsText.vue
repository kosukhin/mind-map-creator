<script lang="ts" setup>
import { useShare } from '@vueuse/core';
import { computed, ref } from '@vue/reactivity';
import { useI18n } from 'vue-i18n';
import BaseModal from '@/components/BaseModal/BaseModal.vue';
import BaseButton from '@/components/BaseButton/BaseButton.vue';
import { useOverlayAutoClose } from '@/composables/useOverlayAutoclose';
import { SHOW_TEXT } from '@/constants/overlays';
import { nl2br, stripHtml } from '@/utils/common';
import BaseTextTitle from '@/components/BaseText/BaseTextTitle.vue';
import { mapOpened } from '@/domains/data/mapOpened';

useOverlayAutoClose(SHOW_TEXT);

const map = mapOpened;
const mapAsString = computed(() => (
  (map.value
      && Object.values(map.value.objects)
        .map((object) => `<div class="TheMapAsText-Item">
          <h3>
          ${nl2br(object.name)}
          </h3>
          <p>
          ${nl2br(object.additionalName || '')}
          </p>
          <p>
          ${nl2br(object.description || '')}
          </p>
          <p>
            ${object.additionalFields && Object.values(object.additionalFields).join('</p><p>')}
          </p>
        </div>`)
        .join(''))
    ?? ''
));

const i18n = useI18n();
const { share, isSupported } = useShare();
const onShare = () => {
  if (!isSupported.value) {
    alert(i18n.t('general.notifications.sharingDontSupported'));
  }

  share({
    text: stripHtml(mapAsString.value),
  });
};

const textRef = ref();
const onSelectAll = () => {
  if (map.value) {
    const range = new Range();
    range.setStart(textRef.value, 0);
    range.setEnd(textRef.value, Object.values(map.value.objects).length);
    document.getSelection()?.removeAllRanges();
    document.getSelection()?.addRange(range);
  }
};
</script>

<template>
  <BaseModal :name="SHOW_TEXT">
    <template #header>
      <BaseTextTitle class="block mb-3">
        {{ $t('general.mapAsText') }}
        <div class="flex gap-1">
          <BaseButton
            size="sm"
            type="success"
            class="font-normal"
            @click="onShare"
          >
            {{ $t('general.share') }}
          </BaseButton>
          <BaseButton
            size="sm"
            type="primary"
            class="font-normal"
            @click="onSelectAll"
          >
            {{ $t('general.selectAll') }}
          </BaseButton>
        </div>
      </BaseTextTitle>
    </template>
    <article v-if="map" class="TheMapAsText">
      <div ref="textRef" v-html="mapAsString"></div>
    </article>
  </BaseModal>
</template>
