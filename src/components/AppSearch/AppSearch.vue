<script lang="ts" setup>
import { computed } from '@vue/reactivity';
import BaseInput from '@/components/BaseInput/BaseInput.vue';
import { useOverlayAutoClose } from '@/composables/useOverlayAutoclose';
import { SHOW_SEARCH } from '@/constants/overlays';
import { useMap } from '@/composables/useMap';
import { useOverlay } from '@/composables/useOverlay';
import { useMoveToObject } from '@/composables/useMoveToObject';
import BaseSelect from '@/components/BaseSelect/BaseSelect.vue';
import BaseButton from '@/components/BaseButton/BaseButton.vue';
import {
  always,
  any,
  applyTo,
  converge,
  defaultTo,
  equals,
  filter,
  head,
  identity,
  lensPath,
  not,
  or,
  prop,
  remove,
  values,
  view,
  when,
} from 'ramda';
import { compose, pipe } from '@/utils/cmps';
import { lensValue } from '@/utils/lensValue';
import { lensType } from '@/utils/lensType';
import { list } from '@/utils/list';
import { isTruthy } from '@/utils/isTruthy';
import { delay } from '@/utils/delay';
import { mapObjectsComparatorByType, mapObjectsGet, mapTypesListPure } from '@/domains/map';
import { searchByField, searchByList, searchNamedSavePure } from '@/domains/search';
import { isValueFilled } from '@/domains/conditions';
import { formResetPure } from '@/domains/form';
import { ref } from 'vue';
import { setRef } from '@/utils/setRef';
import { setLens } from '@/utils/setLens';

useOverlayAutoClose(SHOW_SEARCH);

const query = ref('');
const { map } = useMap();
const type = ref('');
const mapTypes = computed(() => mapTypesListPure(map));

const typeComparator = converge(mapObjectsComparatorByType, [
  () => view(lensValue, type),
  identity,
]);

const findByType = filter(typeComparator);

const isFoundInAdditionalFilters = converge(searchByList, [
  always('additionalFields'),
  () => view(lensValue, query),
  identity,
]);
const findByName = converge(searchByField, [
  always('name'),
  () => view(lensValue, query),
  identity,
]);
const findByAdditionalName = converge(searchByField, [
  always('additionalName'),
  () => view(lensValue, query),
  identity,
]);

const commonSearch = converge(
  compose(any(equals(true)), list),
  [
    isFoundInAdditionalFilters,
    findByName,
    findByAdditionalName,
  ],
);

const typeSelected: any = () => isValueFilled(type);
const queryFilled: any = () => isValueFilled(query);

const nothingFilled = converge(compose(not, or), [
  queryFilled,
  typeSelected,
]);

const searchResults = computed(() => applyTo(map, pipe(
  mapObjectsGet,
  when(typeSelected, findByType),
  when(queryFilled, filter(commonSearch)),
  when(nothingFilled, always([])),
)));

const { close } = useOverlay();
const { scrollToObject } = useMoveToObject();

const moveToObject = compose(close, scrollToObject, prop('id'));
const showFirstAdditionalField = compose(head, filter(Boolean), values);

const namedSearchFormShowed = ref(false);
const namedSearchForm = ref({
  name: '',
  query: '',
  type: '',
});
const lensNamedSearches = compose(lensValue, lensPath(['namedSearches']));

const namedSearchSave = pipe(
  () => searchNamedSavePure(
    view(lensValue, namedSearchForm),
    view(lensValue, map),
  ),
  setRef(map),
);
const namedSearchFormClose = () => setRef(namedSearchFormShowed, false);
const namedSearchFormReset = () => applyTo(namedSearchForm, compose(
  setRef(namedSearchForm),
  formResetPure,
));
const namedSearchCommonSave = compose(
  namedSearchSave,
  namedSearchFormClose,
  () => delay(namedSearchFormReset),
);

const namedSearchByIndex = converge(prop as any, [
  identity,
  () => view(compose(lensValue, lensPath(['namedSearches'])), map),
]);
const namedSearchApplyIndex = compose(converge(list, [
  when(isTruthy, compose(setRef(query), view(lensPath(['query'])))),
  when(isTruthy, compose(setRef(type), view(lensType))),
]), namedSearchByIndex);

const namedSearchRemoveByIndex = converge(compose(
  setRef(map),
  view(lensValue),
  setLens(lensNamedSearches, map),
  remove,
), [
  identity,
  always(1),
  () => applyTo(map, pipe(
    view(lensNamedSearches),
    defaultTo([]),
  )),
]);
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
        <BaseButton type="success" @click="namedSearchCommonSave">
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
        <b class="AppSearch-ItemName" v-html="result.name"></b>
        <b v-if="result.additionalName" v-html="result.additionalName" class="AppSearch-ItemName">
        </b>
        <div v-else v-html="showFirstAdditionalField(result.additionalFields ?? {})">
        </div>
      </div>
    </div>
    <div v-else-if="query">{{ $t('general.noResults') }}</div>
  </div>
</template>
