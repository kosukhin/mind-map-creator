<script lang="ts" setup>
import BaseModal from '@/components/BaseModal/BaseModal.vue';
import BaseButton from '@/components/BaseButton/BaseButton.vue';
import BaseInput from '@/components/BaseInput/BaseInput.vue';
import { useApplication } from '@/composables/useApplication';
import { VueRefPatron } from '@/modules/integration/vue/VueRefPatron';
import { MapDocument } from '@/modules/application/l1/l2/l3/map/documents/MapStructures';
import { useFactories } from '@/composables/useFactories';

const {
  modal, mapFile, mapRemoved, mapSettings, controlCombo, parentNames, mapCurrentID,
} = useApplication();
const { patron, guest } = useFactories();

const parentTypes = parentNames.names(new VueRefPatron<string[]>()).ref();

const map = mapFile.currentMap(new VueRefPatron<MapDocument>()).ref();

const mapId = mapCurrentID.id(new VueRefPatron<string>()).ref();

const close = () => {
  modal.receive('');
};

const save = () => {
  mapSettings.receive(map.value.settings);
  close();
};

controlCombo.happenedConditional(
  'KeyS',
  modal.openedByName('settings'),
  patron.create(guest.create(save)),
);
</script>

<template>
  <BaseModal name="settings">
    <template #header>
      <h2 class="text-lg font-bold">{{ $t('general.mapSettings') }}</h2>
    </template>
    <div class="TheSettings" v-if="map?.settings">
      <div class="mb-2">
        <a href="#" class="PageEditor-Download">
          Скачать карту
        </a>
        <div class="TheSettings-Row">
          <div class="flex gap-2 mb-2">
            <BaseButton
              class="text-white"
              type="primary"
            >
              {{ $t('general.jsonExportImport') }}
            </BaseButton>
            <BaseButton
              class="text-white"
              type="primary"
            >
              {{ $t('general.keybindings') }}
            </BaseButton>
            <BaseButton
              v-if="parentTypes.length > 1"
              type="primary"
              class="text-white"
              @click="modal.receive('parentTypes')"
            >
              {{ $t('general.parentTypes') }}
            </BaseButton>
            <BaseButton
              type="primary"
              class="text-white e2e-open-presets"
              @click="modal.receive('presets')"
            >
              Пресеты
            </BaseButton>
          </div>
        </div>
        <div class="mb-2">
          <label>
            <b>{{ $t('general.mapName') }}</b>
            <BaseInput v-model="map.settings.title" />
          </label>
        </div>
        <div class="mb-2">
          <a href="https://github.com/kosukhin/mind-map-creator" target="_blank">
            {{ $t('general.githubRepo') }}
          </a>
        </div>
      </div>
      <div class="flex gap-2">
        <BaseButton class="TheSettings-Button" type="success" @click="save()">
          {{ $t('general.save') }}
        </BaseButton>
        <BaseButton class="TheSettings-Button" @click="close">
          {{ $t('general.cancel') }}
        </BaseButton>
        <BaseButton class="TheSettings-Button" type="danger" @click="mapRemoved.receive(mapId);close()">
          {{ $t('general.removeMap') }}
        </BaseButton>
      </div>
    </div>
  </BaseModal>
</template>
