<script lang="ts" setup>
import { computed, ref } from '@vue/reactivity';
import BaseInput from '@/components/BaseInput/BaseInput.vue';
import { useOverlayAutoClose } from '@/composables/useOverlayAutoclose';
import { SHOW_SEARCH } from '@/constants/overlays';
import { useMap } from '@/composables/useMap';
import { useOverlay } from '@/composables/useOverlay';
import { useMoveToObject } from '@/composables/useMoveToObject';
import { MapObject } from '@/entities/Map';
import BaseSelect from '@/components/BaseSelect/BaseSelect.vue';
import BaseButton from '@/components/BaseButton/BaseButton.vue';
import { clone } from 'lodash';
import {
  any,
  applyTo,
  converge,
  defaultTo,
  identity,
  includes,
  prop,
  toLower,
  values,
  view,
} from 'ramda';
import { lazy } from '@/utils/lazy';
import { compose } from '@/utils/cmps';
import { lensValue } from '@/utils/lensValue';

useOverlayAutoClose(SHOW_SEARCH);

const type = ref<string>('');
const query = ref('');
const withQuery = applyTo(query);
const { map } = useMap();

const toLowerSafe = compose(toLower, String, defaultTo(''));
const queryComparator = converge(includes, [
  lazy(withQuery, compose(toLowerSafe, view(lensValue))),
  identity,
]);
const isFoundInAdditionalFilters = compose(
  any(compose(queryComparator, toLowerSafe)),
  values,
  prop('additionalFields'),
);

// TODO убрать дублирование
const mapTypes = computed(() => {
  const result: { id: string; name: string }[] = [];

  if (map.value) {
    Object.entries(map.value.types).forEach(([typeId, mapType]) => {
      result.push({
        id: typeId,
        name: mapType.name,
      });
    });
  }

  return [{ id: null, name: 'Любой тип узла' }, ...result];
});

const searchResults = computed(() => {
  if (!map.value) {
    return [];
  }

  let objects = Object.values(map.value.objects);

  if (type.value) {
    objects = objects.filter((object) => object.type === type.value);
  }

  if (query.value) {
    const searchQuery = query.value.toLowerCase();

    return objects.filter((object) => (
      object.name.toLowerCase().includes(searchQuery)
        || isFoundInAdditionalFilters(object)
        || (object.additionalName
          && object.additionalName.toLowerCase().includes(searchQuery))
    ));
  }

  if (type.value) {
    return objects;
  }

  return [];
});

const { close } = useOverlay();
const { scrollToObject } = useMoveToObject();
const moveToObject = (object: MapObject) => {
  close();
  scrollToObject(object.id);
};

const showFirstAdditionalField = (additionalFields: any) => Object
  .values(additionalFields)
  .filter(Boolean).shift();

const namedSearchFormShowed = ref(false);
const namedSearchForm = ref({
  name: '',
  query: '',
  type: '',
});
const namedSearchSave = () => {
  if (map.value) {
    if (!map.value.namedSearches) {
      map.value.namedSearches = [];
    }
    map.value?.namedSearches.push(clone(namedSearchForm.value));
    Object.keys(namedSearchForm.value).forEach((key) => {
      (namedSearchForm.value as any)[key] = '';
    });
    namedSearchFormShowed.value = false;
  }
};

const namedSearchApplyIndex = (index: number) => {
  const search = map.value?.namedSearches?.[index];
  if (search) {
    query.value = search.query;
    type.value = search.type;
  }
};

const namedSearchRemoveByIndex = (index: number) => {
  map.value?.namedSearches?.splice(index, 1);
};
</script>

<template>
  <div class="AppSearch">
    <div class="rounded-main mb-2 w-full p-2 border border-solid border-body-dark">
      <h4 class="text-md font-bold mb-1">Сохраненные поиски</h4>
      <BaseButton
        class="max-w-[150px]"
        @click="namedSearchFormShowed=!namedSearchFormShowed"
      >
        Создать
      </BaseButton>
      <div
        v-if="namedSearchFormShowed"
        class="flex gap-2 items-center my-2"
      >
        <b>Имя</b>
        <BaseInput v-model="namedSearchForm.name" />
        <b>Строка поиска</b>
        <BaseInput v-model="namedSearchForm.query" />
        <b>Тип</b>
        <BaseSelect
          v-model="namedSearchForm.type"
          :items="mapTypes"
          option-id="id"
          option-label="name"
        />
        <BaseButton type="success" @click="namedSearchSave">
          Сохранить
        </BaseButton>
      </div>
      <div v-if="map" class="flex py-3 gap-4">
        <span
          :key="`nsearch-${index}`"
          v-for="(nSearch, index) in map.namedSearches"
          style="display: flex; gap: 4px"
        >
          <a
            href="#"
            @click.prevent="namedSearchApplyIndex(index)"
          >
            {{nSearch.name}}
          </a>
          <a href="#" @click.prevent="namedSearchRemoveByIndex(index)">&times;</a>
        </span>
      </div>
    </div>
    <BaseInput
      v-model="query"
      class="mb-2"
      placeholder="Введите запрос"
    />
    <div class="mb-2">
      <BaseSelect
        v-model="type"
        :items="mapTypes"
        option-id="id"
        option-label="name"
        placeholder="Выберите тип"
      />
    </div>
    <div v-if="searchResults.length" class="AppSearch-Items">
      <div
        v-for="result in searchResults"
        :key="result.name"
        class="cursor-pointer"
        @click="moveToObject(result)"
      >
        <b class="AppSearch-ItemName">{{ result.name }}</b>
        <b v-if="result.additionalName" class="AppSearch-ItemName">
          &nbsp;
          {{ result.additionalName }}
        </b>
        <div v-else>
          {{ showFirstAdditionalField(result.additionalFields ?? {}) }}
        </div>
      </div>
    </div>
    <div v-else-if="query">{{ $t('general.noResults') }}</div>
  </div>
</template>
