import { AnyFn, createSharedComposable } from '@vueuse/core';
import { createLayer } from '@/utils/konva';
import { shallowRef } from 'vue';
import { useCanvas } from '@/composables/useCanvas';
import { Layer } from 'konva/lib/Layer';
import { Stage } from 'konva/lib/Stage';
import { MapLayerObjects } from '@/entities/MapLayerObjects';
import { findById } from '@/utils/dom';
import { CANVAS_DOM_ID } from '@/constants/system';
import { setValue } from '@/utils/common';
import { modelsPoolSet } from '@/modulesHigh/models/modelsPool';

export const useLayer = createSharedComposable(() => {
  const { canvas } = useCanvas();
  const layer = shallowRef<Layer>();
  const stage = shallowRef<Stage>();
  modelsPoolSet('layer', layer);
  modelsPoolSet('stage', stage);
  const layerObjects: MapLayerObjects = new Map();

  const doCreateLayer = (afterCreatedCb: AnyFn) => {
    setTimeout(() => {
      const wrapper = findById(CANVAS_DOM_ID);
      canvas.value = wrapper ?? undefined;

      if (wrapper) {
        const [newLayer, newStage] = createLayer(wrapper);
        setValue(layer, newLayer);
        setValue(stage, newStage);
      }

      afterCreatedCb();
    }, 0);
  };

  return {
    layer,
    stage,
    layerObjects,
    createLayer: doCreateLayer,
  };
});
