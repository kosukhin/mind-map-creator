import { MapLayer, Maybe } from "~/entities";
import { createSharedComposable } from "@vueuse/core";
import { shallowReactive } from "@vue/reactivity";

export const useLayer = createSharedComposable(() => {
  const layer = shallowReactive(Maybe<MapLayer>())

  return {
    layer,
  }
});
