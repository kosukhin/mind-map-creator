<script lang="ts" setup>
import { useShare } from '@vueuse/core'
import { computed, ref } from '@vue/reactivity'
import { useI18n } from 'vue-i18n'
import { useSharedMap, useOverlayAutoClose } from '~/composables'
import { SHOW_TEXT } from '~/constants'
import { nl2br, stripHtml } from '~/utils'
import BaseModal from '~/components/BaseModal/BaseModal.vue'
import BaseButton from '~/components/BaseButton/BaseButton.vue'

useOverlayAutoClose(SHOW_TEXT)

const { map } = useSharedMap()
const mapAsString = computed(() => {
  return (
    (map.value &&
      Object.values(map.value.objects)
        .map((object) => {
          return `<div class="TheMapAsText-Item">
          <h3>
          ${nl2br(object.name)}
          </h3>
          <p>
          ${nl2br(object.additionalName || '')}
          </p>
          <p>
          ${nl2br(object.description || '')}
          </p>
        </div>`
        })
        .join('')) ??
    ''
  )
})

const i18n = useI18n()
const { share, isSupported } = useShare()
const onShare = () => {
  if (!isSupported.value) {
    alert(i18n.t('theMapAsText.notifications.sharingDontSupported'))
  }

  share({
    text: stripHtml(mapAsString.value),
  })
}

const textRef = ref()
const onSelectAll = () => {
  if (map.value) {
    const range = new Range()
    range.setStart(textRef.value, 0)
    range.setEnd(textRef.value, Object.values(map.value.objects).length)
    document.getSelection()?.removeAllRanges()
    document.getSelection()?.addRange(range)
  }
}
</script>

<template>
  <BaseModal :name="SHOW_TEXT">
    <template #header>
      <h2 class="TheMapAsText-ModalTitle">
        {{ $t('theMapAsText.mapAsText') }}
        <BaseButton
          size="sm"
          type="success"
          class="TheMapAsText-Share"
          @click="onShare"
        >
          {{ $t('theMapAsText.share') }}
        </BaseButton>
        <BaseButton
          size="sm"
          type="primary"
          class="TheMapAsText-Share"
          @click="onSelectAll"
        >
          {{ $t('theMapAsText.selectAll') }}
        </BaseButton>
      </h2>
    </template>
    <article v-if="map" class="TheMapAsText">
      <div ref="textRef" v-html="mapAsString"></div>
    </article>
  </BaseModal>
</template>

<style lang="scss">
.TheMapAsText-Item {
  margin-bottom: var(--defaultPadding);

  * {
    user-select: all;
  }
}
</style>

<style lang="scss" scoped>
@import 'TheMapAsText';
</style>
