import '@/assets/styles.scss';
import { defaultValue } from '@/domains/application/defaultValue';
import { ensureNotNullish } from '@/domains/application/ensureNotNullish';
import { applicative } from '@/domains/branching/Applicative';
import { apToEnd } from '@/domains/branching/ap';
import { tap } from '@/domains/branching/tap';
import { jsonParse } from '@/domains/browser/jsonParse';
import { readFileHandler } from '@/domains/browser/readFileHandler';
import { useAppInit } from '@/domains/composables/useAppInit';
import { mapFileHandler } from '@/domains/data/mapFileHandler';
import { mapsAll } from '@/domains/data/mapsAll';
import { fileFromFS } from '@/domains/io/fileFromFS';
import i18n from '@/plugins/i18n';
import { createMap } from '@/utils/map';
import { set } from 'lodash';
import partial from 'lodash/partial';
import { createApp } from 'vue';
import App from './App.vue';
import './registerServiceWorker';
import router from './router';

const { init } = useAppInit();

fileFromFS
  .ap(ensureNotNullish)
  .ap(tap(partial(set, mapFileHandler.value(), 'value')))
  .ap(readFileHandler)
  .ap(partial(
    defaultValue,
    `{"current":${JSON.stringify(createMap('current'))}}`,
  ))
  .ap(jsonParse)
  .ap(apToEnd(mapsAll, set, 'value'))
  .ap(init);

// Если файл открыт по ссылке
applicative('Открываем по ссылке')
  .ap(console.log);

createApp(App)
  .use(router)
  .use(i18n)
  .mount('#app');
