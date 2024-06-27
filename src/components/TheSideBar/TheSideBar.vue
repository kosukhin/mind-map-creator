<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import BaseButton from '@/components/BaseButton/BaseButton.vue';
import BaseGroup from '@/components/BaseGroup/BaseGroup.vue';
import BaseIcon from '@/components/BaseIcon/BaseIcon.vue';
import TheGrouper from '@/components/TheGrouper/TheGrouper.vue';
import TheLinker from '@/components/TheLinker/TheLinker.vue';
import { useOverlay } from '@/composables/useOverlay';
import { useMapType } from '@/composables/useMapType';
import { SHOW_SETTINGS, SHOW_TYPE } from '@/constants/overlays';
import { DEFAULT_SVG } from '@/constants/svg';
import { useSideBar } from '@/composables/useSideBar';
import { useLayer } from '@/composables/useLayer';
import { HEADER_HEIGHT, SIDEBAR_WIDTH } from '@/constants/system';
import { createObject } from '@/utils/map';
import { MapObject } from '@/entities/Map';
import { svgRenderDefault } from '@/utils/svgRenderDefault';
import { useMapPartialRenderer } from '@/composables/useMapPartialRenderer';
import { mapOpened } from '@/domains/data/mapOpened';

const { overlayName } = useOverlay();
const { currentTypeId } = useMapType();
const selectType = (name: string) => {
  overlayName.value = SHOW_TYPE;
  currentTypeId.value = name;
};

const i18n = useI18n();
const map = mapOpened;
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

const { isSidebarOpen } = useSideBar();
const { layer, stage, layerObjects } = useLayer();
const { triggerPartialRendering } = useMapPartialRenderer();

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

    const newObject: MapObject = createObject(position, type, vType);

    isSidebarOpen.value = false;
    map.value.objects[newObject.id] = newObject;
    triggerPartialRendering();
  }
};
</script>

<template>
  <div class="flex e2e-sidebar flex-col items-center gap-3 max-h-[100%] overflow-hidden">
    <div v-if="map" class="flex flex-col gap-3 flex-grow w-full overflow-y-auto">
      <div
        v-for="(type, name) in map.types"
        :key="name"
        class="flex flex-col items-center justify-center gap-2"
      >
        <div class="TheSideBar-ItemName">{{ type.name }}</div>
        <div
          v-html="svgRenderDefault(type)"
          class="TheSideBar-ItemImage"
          draggable="true"
          :style="`width:${type.width}px;height:${type.height}px`"
          :title="$t('general.notifications.dragToCanvasToAdd')"
          @dblclick="addToCanvas($event , name, true)"
          @dragend="addToCanvas($event, name)"
        ></div>
        <div class="flex gap-1">
          <BaseButton class="text-white" size="sm" type="primary" @click="selectType(name)">
            {{ $t('general.change') }}
          </BaseButton>
          <BaseButton class="text-white" size="sm" type="danger" @click="removeType(name)">
            {{ $t('general.delete') }}
          </BaseButton>
        </div>
      </div>
    </div>
    <div class="mt-auto p-3 pt-0">
      <BaseGroup class="mb-1 grid gap-1 grid-cols-2">
        <BaseButton
          :title="$t('general.addType')"
          type="success"
          @click="addType"
        >
          <BaseIcon icon="fa-plus-square" />
        </BaseButton>
        <BaseButton
          class="e2e-show-settings"
          :title="$t('general.settings')"
          type="primary"
          @click="overlayName = SHOW_SETTINGS"
        >
          <BaseIcon icon="fa-cog" />
        </BaseButton>
      </BaseGroup>
      <TheLinker class="w-full mb-1" />
      <TheGrouper class="w-full" />
    </div>
  </div>
</template>
