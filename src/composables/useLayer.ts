import { CANVAS_DOM_ID } from '@/constants/system';
import { canvas } from '@/domains/data/canvas';
import { MapLayerObjects } from '@/entities/MapLayerObjects';
import { modelsPoolSet } from '@/modulesHigh/models/modelsPool';
import { setValue } from '@/utils/common';
import { findById } from '@/utils/dom';
import { createLayer } from '@/utils/konva';
import { AnyFn, createSharedComposable } from '@vueuse/core';
import { Layer } from 'konva/lib/Layer';
import { Stage } from 'konva/lib/Stage';
import { shallowRef } from 'vue';

export const useLayer = createSharedComposable(() => {
  const layer = shallowRef<Layer>();
  const stage = shallowRef<Stage>();
  modelsPoolSet('layer', layer);
  modelsPoolSet('stage', stage);
  const layerObjects: MapLayerObjects = new Map();

  const doCreateLayer = (afterCreatedCb: AnyFn) => {
    setTimeout(() => {
      const wrapper = findById(CANVAS_DOM_ID);
      canvas.value().value = wrapper ?? undefined;

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
