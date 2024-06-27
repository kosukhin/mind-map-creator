import i18n from '@/plugins/i18n';
import { createApp } from 'vue';
import { Applicative } from '@/domains/branching/Applicative';
import { fileFromFS } from '@/domains/browser/fileFromFS';
import { readFileHandler } from '@/domains/browser/readFileHandler';
import { jsonParse } from '@/domains/browser/jsonParse';
import { useMap } from '@/composables/useMap';
import partial from 'lodash/partial';
import { set } from 'lodash';
import { allMaps } from '@/domains/data/allMaps';
import { useRequestGetMap } from '@/composables/useRequestGetMap';
import App from './App.vue';
import './registerServiceWorker';
import router from './router';
import '@/assets/styles.scss';

const { getMap } = useRequestGetMap();
const { openMapOfCurrentUrl } = useMap();

new Applicative()
  .ap(fileFromFS)
  .ap(readFileHandler)
  .ap(jsonParse)
  .ap(partial(set, allMaps, 'value'))
  .promise()
  .then(() => getMap('current'))
  .then((mapDetails) => {
    openMapOfCurrentUrl(...mapDetails);
    router.push('/current');
  });

createApp(App).use(router).use(i18n)
  .mount('#app');
