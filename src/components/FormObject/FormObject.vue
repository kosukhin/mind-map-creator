<script lang="ts" setup>
import { computed, ref } from '@vue/reactivity';
import { watch } from '@vue/runtime-core';
import { useClipboard } from '@vueuse/core';
import cloneDeep from 'lodash/cloneDeep';
import BaseButton from '@/components/BaseButton/BaseButton.vue';
import BaseCheckbox from '@/components/BaseCheckbox/BaseCheckbox.vue';
import BaseDrawer from '@/components/BaseDrawer/BaseDrawer.vue';
import BaseInput from '@/components/BaseInput/BaseInput.vue';
import BaseSelect from '@/components/BaseSelect/BaseSelect.vue';
import { updateObjectOnLayer } from '@/utils/konva';
import { useMap } from '@/composables/useMap';
import { useOverlay } from '@/composables/useOverlay';
import { useKeybindings } from '@/composables/useKeybindings';
import { SHOW_OBJECT, SHOW_TRANSFER } from '@/constants/overlays';
import { useMapObject } from '@/composables/useMapObject';
import { createMapObjectUrl } from '@/utils/map';
import { useLayer } from '@/composables/useLayer';
import { MapObject } from '@/entities/Map';
import { useNotify } from '@/composables/useNotify';
import { setValue } from '@/utils/common';
import { COPIED, NOT_SUPPOERTED } from '@/constants/messages';
import { NOTIFY_ERROR, NOTIFY_SUCCESS } from '@/constants/system';
import { getLocation } from '@/utils/globals';
import { useSettings } from '@/composables/useSettings';
import { useObjectActions } from '@/composables/useObjectActions';
import BaseInputTitle from '@/components/BaseInputTitle/BaseInputTitle.vue';
import BaseInputRow from '@/components/BaseInput/BaseInputRow.vue';
import BaseEditor from '@/components/BaseEditor/BaseEditor.vue';
import { overlayController } from '@/modulesHigh/overlay/overlayController';

const { map } = useMap();
const mapTypes = computed(() => {
  const result: { id: string; name: string }[] = [];

  if (map.value) {
    Object.entries(map.value.types).forEach(([typeId, type]) => {
      result.push({
        id: typeId,
        name: type.name,
      });
    });
  }

  return result;
});

const { close, isOpened, open } = useOverlay();
const { ctrlSFired } = useKeybindings();

const form = ref<any>({});
const { currentObject } = useMapObject();
watch(
  currentObject,
  () => {
    if (currentObject.value) {
      form.value = cloneDeep(currentObject.value);
    }
  },
  {
    flush: 'post',
    immediate: true,
  },
);

overlayController.autoClose(SHOW_OBJECT);

const objectUrl = computed({
  get() {
    return createMapObjectUrl(form.value);
  },
  set(value) {
    form.value.outlink = value;
  },
});

const { layer, layerObjects } = useLayer();
const save = async () => {
  close();
  if (currentObject.value && map.value && layer.value) {
    map.value.objects[currentObject.value.id] = {
      ...map.value.objects[currentObject.value.id],
      ...form.value,
      outlink: objectUrl.value,
    };
    await updateObjectOnLayer(
      layerObjects,
      layer.value,
      map.value.objects[currentObject.value.id],
      map.value,
    );
  }
};

watch(ctrlSFired, () => {
  if (!isOpened(SHOW_OBJECT)) {
    return;
  }
  save();
});

const removeRelation = async (index: number) => {
  if (!(form.value as MapObject).arrows) return;
  if (currentObject.value && map.value && layer.value) {
    (form.value as MapObject).arrows.splice(index, 1);
    await updateObjectOnLayer(
      layerObjects,
      layer.value,
      map.value.objects[currentObject.value.id],
      map.value,
    );
  }
};

const cancel = () => {
  close();
};

const { clone } = useMapObject();

const { message } = useNotify();
const { copy, isSupported } = useClipboard();
function onCopyUrl() {
  if (!isSupported) {
    setValue(message, [NOT_SUPPOERTED, NOTIFY_ERROR]);
    return;
  }
  if (currentObject.value) {
    copy(`${getLocation().pathname}#${currentObject.value.id}`);
    setValue(message, [COPIED, NOTIFY_SUCCESS]);
  }
}

const { settings } = useSettings();
const { removeCurrentObject } = useObjectActions();
</script>

<template>
  <BaseDrawer :name="SHOW_OBJECT">
    <template #header>
      <h2 class="text-lg font-bold">{{ $t('general.mapObject') }}</h2>
      <small v-if="currentObject" class="flex gap-2 items-center">
        <span> ID #{{ currentObject.id }} </span>
        <BaseButton size="sm" type="primary" @click="onCopyUrl">
          {{ $t('general.copy') }}
        </BaseButton>
      </small>
    </template>
    <div v-if="settings && form && currentObject" class="flex flex-col gap-2">
      <div class="FormObject-Inner">
        <div class="FormObject-Row">
          <BaseCheckbox
            v-model="form.linked"
            :label="$t('general.nameAsLink')"
          />
        </div>
        <template v-if="form.linked">
          <BaseInputTitle>{{ $t('general.outerLink') }}</BaseInputTitle>
          <div class="FormObject-Row">
            <BaseInput v-model="objectUrl" />
          </div>
          <div class="FormObject-Row">
            <BaseCheckbox
              v-model="form.targetBlank"
              :label="$t('general.inNewTab')"
            />
          </div>
        </template>
        <BaseInputRow class="mb-2" :key="key" v-for="(_, key) in form.additionalFields">
          <BaseInputTitle class="mb-1">
            {{ key }}
          </BaseInputTitle>
          <BaseEditor v-model="form.additionalFields[key]" />
        </BaseInputRow>
        <BaseInputRow>
          <BaseInputTitle>
            {{ $t('general.topName') }}
          </BaseInputTitle>
          <BaseEditor v-model="form.additionalName" />
        </BaseInputRow>
        <BaseInputRow>
          <BaseInputTitle>
            {{ $t('general.bottomName') }}
          </BaseInputTitle>
          <BaseEditor v-model="form.name" />
        </BaseInputRow>
        <BaseInputRow>
          <BaseInputTitle>
            {{ $t('general.description') }}
          </BaseInputTitle>
          <BaseEditor v-model="form.description" />
        </BaseInputRow>
        <BaseInputRow>
          <BaseInputTitle>
            Z-Index
          </BaseInputTitle>
          <BaseInput v-model="form.zindex" type="number" />
        </BaseInputRow>
        <BaseInputRow>
          <BaseInputTitle>
            Width
          </BaseInputTitle>
          <BaseInput v-model="form.width" step="20" type="number" />
        </BaseInputRow>
        <BaseInputRow>
          <BaseInputTitle>
            Height
          </BaseInputTitle>
          <BaseInput v-model="form.height" step="20" type="number" />
        </BaseInputRow>
        <BaseInputRow>
          <BaseInputTitle>
            {{ $t('general.objectType') }}
          </BaseInputTitle>
          <BaseSelect
            v-model="form.type"
            :items="mapTypes"
            option-id="id"
            option-label="name"
          />
        </BaseInputRow>

        <div class="my-2">
          <BaseButton
            class="FormObject-ArrowButton"
            type="primary"
            size="md"
            @click="open(SHOW_TRANSFER)"
          >
            {{ $t('general.transfer') }}
          </BaseButton>
        </div>
        <div class="my-2">
          <BaseCheckbox
            v-model="form.inMenu"
            :label="$t('general.useInMenu')"
          />
        </div>
        <template v-if="form.inMenu">
          <div class="FormObject-Title">{{ $t('general.menuOrder') }}</div>
          <div class="FormObject-Row">
            <BaseInput v-model="form.menuOrder" type="number" />
          </div>
        </template>
        <template v-if="form.arrows && form.arrows.length">
          <div class="FormObject-Title">{{ $t('general.relations') }}</div>
          <div class="FormObject-Row">
            <div
              v-for="(arrow, index) in form.arrows"
              :key="arrow.id"
              class="FormObject-Arrow"
            >
              <span v-if="map?.objects[arrow.id]" class="FormObject-ArrowName">
                #{{ index + 1 }} {{ map.objects[arrow.id].name }}
              </span>
              <BaseButton
                class="FormObject-ArrowButton"
                type="danger"
                size="sm"
                @click="removeRelation(index)"
              >
                {{ $t('general.delete') }}
              </BaseButton>
            </div>
          </div>
        </template>
      </div>
    </div>
    <template #footer>
      <div class="py-3 flex gap-1">
        <BaseButton type="success" @click="save">
          {{ $t('general.save') }}
        </BaseButton>
        <BaseButton type="danger" @click="removeCurrentObject">
          {{ $t('general.delete') }}
        </BaseButton>
        <BaseButton @click="cancel">
          {{ $t('general.cancel') }}
        </BaseButton>
      </div>
    </template>
  </BaseDrawer>
</template>
