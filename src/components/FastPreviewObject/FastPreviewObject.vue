<script lang="ts" setup>
import { useMapObject } from '@/composables/useMapObject';
import BaseButton from '@/components/BaseButton/BaseButton.vue';
import { useMap } from '@/composables/useMap';
import { useLayer } from '@/composables/useLayer';
import Konva from 'konva';
import { nextTick } from '@vue/runtime-core';
import { watch } from 'vue';
import { useObjectActions } from '@/composables/useObjectActions';
import { useMagicKeys, useMouse } from '@vueuse/core';
import { useMapPartialRenderer } from '@/composables/useMapPartialRenderer';
import { useOverlay } from '@/composables/useOverlay';
import { SHOW_OBJECT } from '@/constants/overlays';
import { useObjectLinker } from '@/composables/useObjectLinker';

const { map } = useMap();
const { fastPreviewObjectId, currentObjectId, clone } = useMapObject();
const { layerObjects, layer } = useLayer();

const { overlayName } = useOverlay();
const edit = () => {
  currentObjectId.value = fastPreviewObjectId.value;
  fastPreviewObjectId.value = undefined;
  overlayName.value = SHOW_OBJECT;
};

const tr = new Konva.Transformer({
  rotateEnabled: false,
  keepRatio: false,
  ignoreStroke: false,
});

let isTransformerAddedToLayer = false;
let isInTransform = false;

const detachTransform = () => {
  isInTransform = false;
  tr.nodes([]);
  tr.detach();
};

watch(fastPreviewObjectId, detachTransform);

const { triggerPartialRendering } = useMapPartialRenderer();

const transform = () => {
  if (isInTransform) {
    detachTransform();
    return;
  }
  if (!isTransformerAddedToLayer && layer.value) {
    layer.value.add(tr);
    isTransformerAddedToLayer = true;
  }
  const objects = layerObjects.get(String(fastPreviewObjectId.value));
  const maybeImage = objects?.[0];
  if (layer.value && map.value?.objects && maybeImage instanceof Konva.Image) {
    const object = map.value.objects[String(fastPreviewObjectId.value)];
    tr.nodes([maybeImage]);
    isInTransform = true;
    maybeImage.setAttr('strokeScaleEnabled', false);

    maybeImage.on('transformend', (e) => {
      e.cancelBubble = true;
      const newHeight = Math.round(e.target.height() * e.target.scaleY());
      const newWidth = Math.round(e.target.width() * e.target.scaleX());

      object.width = newWidth;
      object.height = newHeight;
      if (layer.value && map.value) {
        detachTransform();
        triggerPartialRendering();
        setTimeout(() => {
          isInTransform = false;
          transform();
        }, 200);
      }
    });
  }
};
const cancel = () => {
  fastPreviewObjectId.value = undefined;
};

const { removeCurrentObject } = useObjectActions();
const objectDelete = () => {
  currentObjectId.value = fastPreviewObjectId.value;
  nextTick(() => {
    removeCurrentObject();
    fastPreviewObjectId.value = undefined;
  });
};

const { current } = useMagicKeys();
watch(current, () => {
  if (current.has('escape')) {
    fastPreviewObjectId.value = undefined;
  }
});

const { x, y } = useMouse();
const mousePosition = { x: x.value, y: y.value };
watch(fastPreviewObjectId, () => {
  mousePosition.x = x.value + 20;
  mousePosition.y = y.value + 20;
});

const { startToRelation, title, type } = useObjectLinker('Связать');
</script>

<template>
  <transition name="fade">
    <div
      v-if="fastPreviewObjectId"
      class="FastPreviewObject Common-Flex-Column Common-Gap"
      :style="`top: ${mousePosition.y}px;left: ${mousePosition.x}px`"
    >
      <div class="Common-Flex Common-Gap Common-Mb-Md">
        <BaseButton @click="edit" class="Common-MaxWidth-150">
          Редактировать
        </BaseButton>
        <BaseButton
          :disabled="type !== 'default'"
          :type="type"
          @click="startToRelation(fastPreviewObjectId)"
          class="Common-MaxWidth-150"
        >
          {{ title }}
        </BaseButton>
      </div>
      <div class="Common-Flex Common-Gap">
        <BaseButton @click="transform" class="Common-MaxWidth-150">
          Трансформ
        </BaseButton>
        <BaseButton @click="clone(fastPreviewObjectId);cancel()" class="Common-MaxWidth-150">
          Клонировать
        </BaseButton>
        <BaseButton
          type="danger"
          @click="objectDelete"
          class="Common-MaxWidth-150"
        >
          Удалить
        </BaseButton>
        <BaseButton
          class="Common-MaxWidth-150 Common-Ml-auto" @click="cancel"
        >
          &times;
        </BaseButton>
      </div>
    </div>
  </transition>
</template>

<style lang="scss">
@import "FastPreviewObject";
</style>