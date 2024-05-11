import { reactive, ref, shallowRef } from 'vue';
import { MapStructure } from '@/entities/Map';
import { Layer } from 'konva/lib/Layer';
import { Stage } from 'konva/lib/Stage';
import { get, set } from 'lodash';
import { FileWithHandle } from '@/types/fileWithHandle';
import { Dictionary } from '@/entities/Dictionary';

export const modelsPool = reactive({
  allMaps: ref<Dictionary<MapStructure>>({}),
  map: ref<MapStructure>(),
  layer: shallowRef<Layer>(),
  stage: shallowRef<Stage>(),
  overlayName: ref<string>(),
  overlayNameToClose: ref<string>(),
  openedFile: ref<FileSystemFileHandle>(),
  forceFile: ref<FileWithHandle>(),
} as const);
type ModelsPool = typeof modelsPool;

export const modelsPoolGet = <T>(key: keyof ModelsPool, defaultValue: unknown = null) => get(modelsPool, key, defaultValue) as T;

export const modelsPoolSet = (key: keyof typeof modelsPool, value: any) => set(modelsPool, key, value);
