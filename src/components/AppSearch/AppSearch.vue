<script lang="ts" setup>
import { computed, ref } from '@vue/reactivity';
import BaseInput from '@/components/BaseInput/BaseInput.vue';
import { useOverlayAutoClose } from '@/composables/useOverlayAutoclose';
import { SHOW_SEARCH } from '@/constants/overlays';
import { useMap } from '@/composables/useMap';
import { useOverlay } from '@/composables/useOverlay';
import { useMoveToObject } from '@/composables/useMoveToObject';
import BaseSelect from '@/components/BaseSelect/BaseSelect.vue';
import BaseButton from '@/components/BaseButton/BaseButton.vue';
import {
  __,
  always,
  any,
  append,
  applySpec,
  applyTo,
  concat,
  converge,
  defaultTo,
  equals,
  filter,
  fromPairs,
  head,
  identity,
  includes,
  lensPath,
  map as rMap,
  not,
  or,
  path,
  prop, remove,
  set,
  toLower,
  toPairs,
  values,
  view,
  when,
} from 'ramda';
import { lazy } from '@/utils/lazy';
import { compose } from '@/utils/cmps';
import { lensValue } from '@/utils/lensValue';
import { lensTypes } from '@/utils/lensTypes';
import { lensObjects } from '@/utils/lensObjects';
import { lensType } from '@/utils/lensType';
import { list } from '@/utils/list';
import { isTruthy } from '@/utils/isTruthy';
import { useState } from '@/composables/useState';
import { delay } from '@/utils/delay';

useOverlayAutoClose(SHOW_SEARCH);

const [query, setQuery] = useState('');
const withQuery = applyTo(query);
const { map, withMap } = useMap();
const [, setMap] = useState(map);

const mapTypes = computed(lazy(
  withMap,
  compose(
    concat([{ id: null, name: 'Любой тип узла' }]),
    rMap(applySpec({
      id: prop('0'),
      name: path(['1', 'name']),
    })),
    toPairs,
    defaultTo({}),
    view(lensTypes),
    defaultTo({}),
    view(lensValue),
  ),
));

const [type, setType] = useState('');
const withType = applyTo(type);
const typeValue = lazy(
  withType,
  view(lensValue),
);
const typeComparator = converge(equals, [
  typeValue,
  view(lensType),
]);
const getObjects = compose(values, view(compose(lensValue, lensObjects)));
const findByType = filter(typeComparator);

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
const findByName = compose(queryComparator, toLowerSafe, prop('name'));
const findByAdditionalName = compose(queryComparator, toLowerSafe, prop('additionalName'));

const commonSearch = converge(
  compose(any(equals(true)), list),
  [
    isFoundInAdditionalFilters,
    findByName,
    findByAdditionalName,
  ],
);

const isValueFilled = compose(isTruthy, view(lensValue));
const typeSelected = lazy(withType, isValueFilled);
const queryFilled = lazy(withQuery, isValueFilled);

const nothingFilled = converge(compose(not, or), [
  queryFilled,
  typeSelected,
]);

const searchResults = computed(lazy(
  withMap,
  compose(
    when(nothingFilled, always([])),
    when(queryFilled, filter(commonSearch)),
    when(typeSelected, findByType),
    getObjects,
  ),
));

const { close } = useOverlay();
const { scrollToObject } = useMoveToObject();

const moveToObject = compose(close, scrollToObject, prop('id'));

const showFirstAdditionalField = compose(head, filter(Boolean), values);

const namedSearchFormShowed = ref(false);
const [, setNamedSearchFormShowed] = useState(namedSearchFormShowed);
const namedSearchForm = ref({
  name: '',
  query: '',
  type: '',
});
const [, setNamedSearchForm] = useState(namedSearchForm);
const withNamedSearchForm = applyTo(namedSearchForm);

const lensNamedSearches = compose(lensValue, lensPath(['namedSearches']));

const myClone = compose(JSON.parse, JSON.stringify);
const appendNamedFormValue = converge(append, [
  lazy(
    withNamedSearchForm,
    compose(myClone, view(lensValue)),
  ),
  identity,
]);
const namedSearchSave = lazy(
  withMap,
  compose(
    setMap,
    view(lensValue),
    set(lensNamedSearches, __, map),
    appendNamedFormValue,
    defaultTo([]),
    view(lensNamedSearches),
  ),
);
const namedSearchFormClose = lazy(
  setNamedSearchFormShowed,
  false,
);
const namedSearchFormReset = lazy(
  withNamedSearchForm,
  compose(
    setNamedSearchForm,
    fromPairs,
    rMap(set(lensPath([1]), '')),
    toPairs,
  ),
);
const namedSearchCommonSave = compose(
  namedSearchSave,
  namedSearchFormClose,
  lazy(delay, namedSearchFormReset),
);

const namedSearch = converge(prop as any, [
  identity,
  lazy(
    withMap,
    view(compose(lensValue, lensPath(['namedSearches']))),
  ),
]) as any;
const namedSearchApplyIndex = compose(converge(list, [
  when(isTruthy, compose(setQuery, view(lensPath(['query'])))),
  when(isTruthy, compose(setType, view(lensType))),
]), namedSearch);

const namedSearchRemoveByIndex = converge(compose(
  setMap,
  view(lensValue),
  set(lensNamedSearches, __, map),
  remove,
), [
  identity,
  always(1),
  lazy(
    withMap,
    compose(
      defaultTo([]),
      view(lensNamedSearches),
    ),
  ),
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
