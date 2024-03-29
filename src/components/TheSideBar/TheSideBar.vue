<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import svg64 from 'svg64';
import BaseButton from '@/components/BaseButton/BaseButton.vue';
import BaseGroup from '@/components/BaseGroup/BaseGroup.vue';
import BaseIcon from '@/components/BaseIcon/BaseIcon.vue';
import TheGrouper from '@/components/TheGrouper/TheGrouper.vue';
import TheLinker from '@/components/TheLinker/TheLinker.vue';
import { addObjectToLayer } from '@/utils/konva';
import { useSharedOverlay } from '@/composables/useSharedOverlay';
import { useSharedMapType } from '@/composables/useSharedMapType';
import { SHOW_SETTINGS, SHOW_TYPE } from '@/constants/overlays';
import { useSharedMap } from '@/composables/useSharedMap';
import { DEFAULT_SVG } from '@/constants/svg';
import { useSharedSideBar } from '@/composables/useSharedSideBar';
import { useSharedLayer } from '@/composables/useSharedLayer';
import { HEADER_HEIGHT, SIDEBAR_WIDTH } from '@/constants/system';
import { createObject } from '@/utils/map';
import { MapObject } from '@/entities/Map';
import { KonvaLayerObject } from '@/entities/Konva';
import { svgRenderDefault } from '@/utils/svgRenderDefault';

const { overlayName } = useSharedOverlay();
const { currentTypeId } = useSharedMapType();
const selectType = (name: string) => {
  overlayName.value = SHOW_TYPE;
  currentTypeId.value = name;
};

const i18n = useI18n();
const { map } = useSharedMap();
const addType = () => {
  if (map.value) {
    const newTypeId = Date.now().toString();
    map.value.types[newTypeId] = {
      name: i18n.t('general.newType'),
      svg: DEFAULT_SVG,
      width: 100,
      height: 100,
    };
    currentTypeId.value = newTypeId;
    overlayName.value = SHOW_TYPE;
  }
};

const removeType = (typeId: string) => {
  if (map.value) {
    let isTypeUsed = false;
    Object.values(map.value.objects).forEach((object) => {
      if (object.type === typeId) {
        isTypeUsed = true;
      }
    });

    if (isTypeUsed) {
      alert(i18n.t('general.notifications.impossibleToRemoveType'));
      return;
    }

    delete map.value.types[typeId];
  }
};

const { isSidebarOpen } = useSharedSideBar();
const { layer, stage, layerObjects } = useSharedLayer();
const addToCanvas = async (
  e: DragEvent,
  type: string,
  useStagePosition = false,
) => {
  if (layer.value && map.value && stage.value) {
    const vType = map.value.types[type];
    let position: [number, number] = [
      e.x - SIDEBAR_WIDTH - vType.width / 2 + stage.value.x() * -1,
      e.y - HEADER_HEIGHT - vType.height / 2 + stage.value.y() * -1,
    ];

    if (useStagePosition) {
      position = [stage.value.x() * -1, stage.value.y() * -1];
    }

    const newObject: MapObject = createObject(position, type);

    isSidebarOpen.value = false;
    map.value.objects[newObject.id] = newObject;
    const objects = await addObjectToLayer(layer.value, newObject, map.value);
    layerObjects.set(newObject.id, objects as KonvaLayerObject[]);
  }
};
</script>

<template>
  <div class="TheSideBar">
    <div v-if="map" class="TheSideBar-Items">
      <div
        v-for="(type, name) in map.types"
        :key="name"
        class="TheSideBar-Item"
      >
        <div class="TheSideBar-ItemName">{{ type.name }}</div>
        <img
          :alt="$t('general.notifications.dragToCanvasToAdd')"
          :src="svg64(svgRenderDefault(type.svg))"
          class="TheSideBar-ItemImage"
          draggable="true"
          :title="$t('general.notifications.dragToCanvasToAdd')"
          @dblclick="addToCanvas($event as any, name, true)"
          @dragend="addToCanvas($event, name)"
        />
        <div class="TheSideBar-ItemButtons">
          <BaseButton size="sm" type="primary" @click="selectType(name)">
            {{ $t('general.change') }}
          </BaseButton>
          <BaseButton size="sm" type="danger" @click="removeType(name)">
            {{ $t('general.delete') }}
          </BaseButton>
        </div>
      </div>
    </div>
    <div class="TheSideBar-Footer">
      <BaseGroup>
        <BaseButton
          :title="$t('general.addType')"
          type="success"
          @click="addType"
        >
          <BaseIcon icon="fa-plus-square" />
        </BaseButton>
        <BaseButton
          :title="$t('general.settings')"
          type="primary"
          @click="overlayName = SHOW_SETTINGS"
        >
          <BaseIcon icon="fa-cog" />
        </BaseButton>
      </BaseGroup>
      <TheLinker />
      <TheGrouper />
    </div>
  </div>
</template>

<style scoped lang="scss">
@import 'TheSideBar';
</style>
