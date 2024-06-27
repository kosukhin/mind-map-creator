<script setup lang="ts">
import { useLayerListeners } from '@/composables/useLayerListeners';
import { useMapRenderer } from '@/composables/useMapRenderer';
import { useLayer } from '@/composables/useLayer';
import { CANVAS_DOM_ID } from '@/constants/system';
import {
  onMounted, onUpdated, ref, watch,
} from 'vue';
import { calculateVisibleObjects } from '@/application/layerDragObjectHandler';
import { MapObject } from '@/entities/Map';
import { useLayerEvents } from '@/composables/useLayerEvents';
import { renderSvgTemplate } from '@/utils/svgRenderDefault';
import { useFps } from '@vueuse/core';
import debounce from 'lodash/debounce';
import { openUrlByObject } from '@/utils/map';
import { mapOpened } from '@/domains/data/mapOpened';

useMapRenderer();
const counter = ref(0);

const { createLayer, layer, stage } = useLayer();
onMounted(() => {
  if (layer.value) {
    layer.value.destroy();
  }

  if (stage.value) {
    stage.value.destroy();
  }

  createLayer(useLayerListeners);
});

const objectsRendered = ref<any>([]);
const map = mapOpened;
const { dragmove, dragend, wheel } = useLayerEvents();

const recalcObjectsRendered = () => {
  objectsRendered.value = [];

  if (!map.value || !stage.value) {
    return;
  }
  const vMap = map.value;
  const [visible] = calculateVisibleObjects(map.value, stage.value);
  const stagePosition = stage.value.position();

  objectsRendered.value = visible.map((obj: MapObject) => {
    const position = [...obj.position];
    if (dragmove.value?.target && dragmove.value.target.attrs.objectId === obj.id) {
      const targetPosition = dragmove.value.target.position();
      position[0] = targetPosition.x;
      position[1] = targetPosition.y;
    }
    return {
      obj,
      viewPosition: stage.value?.position(),
      width: obj.width,
      height: obj.height,
      top: position[1] + stagePosition.y,
      left: position[0] + stagePosition.x,
      html: renderSvgTemplate(obj, vMap),
    };
  });
};

watch([dragmove, dragend, wheel], recalcObjectsRendered);

watch(map, recalcObjectsRendered, {
  deep: true,
});

const fps = useFps();

onUpdated(debounce(() => {
  const rendered = document.querySelectorAll('.rendered-object');
  Array.from(rendered).forEach((el) => {
    const objId = el.getAttribute('data-object-id') as string;

    if (map.value && map.value.objects[objId]) {
      const obj = map.value.objects[objId];
      if (el.clientWidth !== obj.width || el.clientHeight !== obj.height) {
        console.log('update size', el);
        obj.height = el.clientHeight;
      }
    }
  });
}, 1000));

const onObjectClick = openUrlByObject;
</script>

<template>
  <div class="relative">
    <div class="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden z-1">
      <div class="text-sm p-2 absolute bottom-0 left-0">
        Видимых объектов: {{objectsRendered.length}}, FPS: {{ fps }}
      </div>
      <div class="absolute bottom-3 shadow-standard-second shadow-md drop-shadow right-3 z-10">
        <div class="grid-example grid grid-rows-2 grid-cols-2 bg-standard-second border border-standard-second gap-[1px] border-t-0 border-l-0">
          <div class="w-[14px] h-[14px] bg-white"></div>
          <div class="w-[14px] h-[14px] bg-white"></div>
          <div class="w-[14px] h-[14px] bg-white"></div>
          <div class="w-[14px] h-[14px] bg-white"></div>
        </div>
      </div>
      <div
        v-for="obj in objectsRendered"
        :key="obj.obj.id"
        class="absolute"
        :style="`width:${obj.obj.width}px;height: ${obj.obj.height}px;top: ${obj.top}px;left:${obj.left}px;z-index:${obj.obj.zindex}`"
      >
        <div class="absolute bottom-[100%] text-nowrap left-[50%] translate-x-[-50%] text-center pb-2 pointer-events-auto text-sm">
          <span
            v-html="obj.obj.additionalName"
            @click="onObjectClick(obj.obj)"
            :class="[obj.obj.linked && 'cursor-pointer underline']"
          ></span>
        </div>
        <div class="absolute top-[100%] text-nowrap left-[50%] translate-x-[-50%] text-center pt-2 text-sm" v-html="obj.obj.name"></div>
        <div :data-object-id="obj.obj.id" class="rendered-object" v-html="obj.html"></div>
      </div>
    </div>
    <div class="h-full" :id="CANVAS_DOM_ID" :key="'editor-canvas' + counter"></div>
  </div>
</template>
