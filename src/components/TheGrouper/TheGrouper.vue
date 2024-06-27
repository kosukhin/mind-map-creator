<script lang="ts" setup>
import { computed, ref } from '@vue/reactivity';
import { watch } from '@vue/runtime-core';
import Konva from 'konva';
import flattenDeep from 'lodash/flattenDeep';
import { useI18n } from 'vue-i18n';
import BaseButton from '@/components/BaseButton/BaseButton.vue';
import { AnyFn } from '@vueuse/core';
import { useLayer } from '@/composables/useLayer';
import { useMapObject } from '@/composables/useMapObject';
import { useLocks } from '@/composables/useLocks';
import { cloneObject } from '@/utils/konva';
import { MapStructure } from '@/entities/Map';
import { mapOpened } from '@/domains/data/mapOpened';

const { layer, layerObjects } = useLayer();
const i18n = useI18n();
const title = ref(i18n.t('general.group'));
const type = ref('standard');
const isGrouping = computed(() => type.value === 'danger');
const map = mapOpened;
const { currentObjectId, fastPreviewIsLocked } = useMapObject();
let stopNextObjectWatcher: AnyFn | null = null;
const { isClickLocked } = useLocks();
const groups = new Set();
let transformer = new Konva.Group({});

function createSelection(nodes: any) {
  nodes.forEach((node: any) => {
    node.draggable(false);
    transformer.add(node);

    if (node instanceof Konva.Text) {
      node.fill('#f00');
    }
  });
}

function findNodes() {
  return flattenDeep(
    Array.from(groups).map((objectId) => layerObjects.get(objectId as string)) as any,
  );
}

const cloneGroup = () => {
  [...groups].forEach(async (objectId) => {
    if (map.value && layer.value) {
      const vObj = map.value.objects[objectId as string];
      await cloneObject(vObj, map.value, layer.value, layerObjects);
    }
  });
};

const stopWatcher = () => {
  if (!stopNextObjectWatcher) {
    return;
  }
  stopNextObjectWatcher();
  stopNextObjectWatcher = null;
  isClickLocked.value = false;
  title.value = i18n.t('general.group');
  type.value = 'standard';
  groups.clear();
  fastPreviewIsLocked.value = false;
};

const onClick = () => {
  fastPreviewIsLocked.value = true;
  transformer = new Konva.Group({
    draggable: true,
  });
  transformer.on('dragend', () => {
    const nodes = findNodes();

    if (map.value) {
      nodes.forEach((node) => {
        if (node instanceof Konva.Rect) {
          const object = (map.value as MapStructure).objects[
            node.attrs.objectId
          ];
          object.position = [
            node.x() + transformer.x(),
            node.y() + transformer.y(),
          ];
        }
      });
    }
  });

  if (layer.value) {
    layer.value.add(transformer);
  }

  if (stopNextObjectWatcher) {
    stopWatcher();
    return;
  }

  title.value = 'Отменить';
  type.value = 'danger';
  isClickLocked.value = true;
  currentObjectId.value = undefined;
  stopNextObjectWatcher = watch(currentObjectId, () => {
    if (!currentObjectId.value) {
      return;
    }

    if (groups.has(currentObjectId.value)) {
      groups.delete(currentObjectId.value);
    } else {
      groups.add(currentObjectId.value);
    }

    const objects = findNodes();

    createSelection(objects);
    setTimeout(() => {
      currentObjectId.value = undefined;
    });
  });
};
</script>

<template>
  <div v-if="isGrouping" key="grouper-panel" class="TheGrouper-Panel">
    <BaseButton class="w-full" type="primary" @click="cloneGroup">
      {{ $t('general.clone') }}
    </BaseButton>
  </div>
  <BaseButton class="w-full" :type="type" @click="onClick"> {{ title }} </BaseButton>
</template>
