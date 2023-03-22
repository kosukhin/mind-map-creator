import { MapLayer } from "~/entities/MapLayer";
import { createLayer } from "~/utils/konva/createLayer";
import { createSharedComposable } from "@vueuse/core";
import { shallowRef } from "@vue/reactivity";
import {Nullable} from '~/entities/types/Nullable';

export const useLayer = createSharedComposable(() => {
  let layer = shallowRef<Nullable<MapLayer>>(null)

  return {
    layer,
    // TODO это нужно убрать пользовать createLayer в компоненте напрямую
    createLayer: (element: HTMLElement) => {
      layer.value = createLayer(element)
    }
  }
});