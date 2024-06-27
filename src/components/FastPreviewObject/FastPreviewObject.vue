<script lang="ts" setup>
import { useMapObject } from '@/composables/useMapObject';
import BaseButton from '@/components/BaseButton/BaseButton.vue';
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
import { gridFitSize } from '@/utils/gridFitSize';
import { mapOpened } from '@/domains/data/mapOpened';

const map = mapOpened;
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
  draggable: false,
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
  if (layer.value && map.value?.objects && maybeImage instanceof Konva.Rect) {
    const object = map.value.objects[String(fastPreviewObjectId.value)];
    tr.nodes([maybeImage]);
    isInTransform = true;
    maybeImage.setAttr('strokeScaleEnabled', false);

    maybeImage.on('transformend', (e) => {
      e.cancelBubble = true;
      const newHeight = gridFitSize(Math.round(e.target.height() * e.target.scaleY()));
      const newWidth = gridFitSize(Math.round(e.target.width() * e.target.scaleX()));

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
      class="absolute flex flex-col gap-1 p-2 rounded-main z-10 bg-body"
      :style="`top: ${mousePosition.y}px;left: ${mousePosition.x}px`"
    >
      <div class="flex gap-1">
        <BaseButton @click="edit" class="max-w-[150px]">
          Редактировать
        </BaseButton>
        <BaseButton
          :disabled="type !== 'standard'"
          :type="type"
          @click="startToRelation(fastPreviewObjectId)"
          class="max-w-[150px]"
        >
          {{ title }}
        </BaseButton>
      </div>
      <div class="flex gap-1">
        <BaseButton @click="transform" class="max-w-[150px]">
          Трансформ
        </BaseButton>
        <BaseButton @click="clone(fastPreviewObjectId);cancel()" class="max-w-[150px]">
          Клонировать
        </BaseButton>
        <BaseButton
          type="danger"
          @click="objectDelete"
          class="text-white"
        >
          Удалить
        </BaseButton>
        <BaseButton
          class="max-w-[150px] ml-auto" @click="cancel"
        >
          &times;
        </BaseButton>
      </div>
    </div>
  </transition>
</template>
