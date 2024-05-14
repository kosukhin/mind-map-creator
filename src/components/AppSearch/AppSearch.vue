<script lang="ts" setup>
import BaseInput from '@/components/BaseInput/BaseInput.vue';
import { SHOW_SEARCH } from '@/constants/overlays';
import BaseSelect from '@/components/BaseSelect/BaseSelect.vue';
import BaseButton from '@/components/BaseButton/BaseButton.vue';
import { overlayController } from '@/modulesHigh/overlay/overlayController';
import { useSearch } from '@/app/useSearch';
import { useMapBehaviour } from '@/app/useMapBehaviour';
import { mapObjectTransformer } from '@/modules/map/mapObjectTransformer';
import { useSearchNamed } from '@/app/useSearchNamed';
import { branchCombinator } from '@/modules/combinators/branchCombinator';
import { MapStructure, NamedSearch } from '@/entities/Map';
import { modelsPoolGet } from '@/modulesHigh/models/modelsPool';

overlayController.autoClose(SHOW_SEARCH);

const {
  typeField,
  queryField,
  mapTypes,
  searchResults,
  isSearchedAnything,
} = useSearch();
const { moveToObject } = useMapBehaviour();
const {
  namedSearches,
  namedSearchRemoveByIndex,
  namedSearchSave,
  namedSearchFormShowed,
  namedSearchForm,
} = useSearchNamed();
const { firstAdditionalField } = mapObjectTransformer;

const namedSearchApplyIndex = (index: number) => {
  const map = modelsPoolGet<MapStructure>('map');
  const search = map?.namedSearches?.[index] as NamedSearch;
  branchCombinator.when(search, () => {
    queryField.value = search.query;
    typeField.value = search.type;
  });
};
</script>

<template>
  <div class="AppSearch">
    <div class="rounded-main mb-2 w-full p-2 border border-solid border-body-dark">
      <h4 class="text-md font-bold mb-1">{{ $t('general.savedSearches') }}</h4>
      <BaseButton
        class="max-w-[150px] e2e-named-search-create"
        @click.exact="namedSearchFormShowed=!namedSearchFormShowed"
      >
        {{ $t('general.create') }}
      </BaseButton>
      <div
        v-if="namedSearchFormShowed"
        class="flex gap-2 items-center my-2"
      >
        <b>{{ $t('general.named') }}</b>
        <BaseInput class="e2e-named-search-name" v-model="namedSearchForm.name" />
        <b>{{ $t('general.searchString') }}</b>
        <BaseInput class="e2e-named-search-query" v-model="namedSearchForm.query" />
        <b>{{ $t('general.type') }}</b>
        <BaseSelect
          class="e2e-named-search-type"
          v-model="namedSearchForm.type"
          :items="mapTypes"
          option-id="id"
          option-label="name"
        />
        <BaseButton class="e2e-named-search-save" type="success" @click="namedSearchSave">
          {{ $t('general.save') }}
        </BaseButton>
      </div>
      <div class="flex py-3 gap-4">
        <span
          :key="`nsearch-${index}`"
          v-for="(nSearch, index) in namedSearches"
          style="display: flex; gap: 4px"
        >
          <a
            href="#"
            class="e2e-named-search-variant"
            @click.prevent="namedSearchApplyIndex(index)"
          >
            {{nSearch.name}}
          </a>
          <a
            href="#"
            @click.prevent="namedSearchRemoveByIndex(index)"
            class="e2e-named-search-remove"
          >
            &times;
          </a>
        </span>
      </div>
    </div>
    <BaseInput
      v-model="queryField"
      class="mb-2 e2e-query-input"
      :placeholder="$t('general.specifyQuery')"
    />
    <div class="mb-2">
      <BaseSelect
        class="e2e-type-input"
        v-model="typeField"
        :items="mapTypes"
        option-id="id"
        option-label="name"
        :placeholder="$t('general.specifyType')"
      />
    </div>
    <div v-if="isSearchedAnything && searchResults.length" class="AppSearch-Items">
      <div
        v-for="result in searchResults"
        :key="result.name"
        class="cursor-pointer"
        @click="moveToObject(result.id)"
      >
        <b class="AppSearch-ItemName" v-html="result.name"></b>
        <b
          v-if="result.additionalName"
          class="AppSearch-ItemName"
          v-html="result.additionalName"
        ></b>
        <div v-else v-html="firstAdditionalField(result)"></div>
      </div>
    </div>
    <div v-else-if="queryField">{{ $t('general.noResults') }}</div>
    <div v-else>{{ $t('general.resultsWillBeHere') }}</div>
  </div>
</template>
