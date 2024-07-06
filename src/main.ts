import i18n from '@/plugins/i18n';
import { createApp } from 'vue';
import { Applicative } from '@/domains/branching/Applicative';
import { fileFromFS } from '@/domains/io/fileFromFS';
import { readFileHandler } from '@/domains/browser/readFileHandler';
import { jsonParse } from '@/domains/browser/jsonParse';
import partial from 'lodash/partial';
import { set } from 'lodash';
import { mapsAll } from '@/domains/data/mapsAll';
import { ensureNotNullish } from '@/domains/application/ensureNotNullish';
import { mapFileHandler } from '@/domains/data/mapFileHandler';
import { tap } from '@/domains/branching/tap';
import { defaultValue } from '@/domains/application/defaultValue';
import { createMap } from '@/utils/map';
import { useAppInit } from '@/domains/composables/useAppInit';
import { apToEnd } from '@/domains/branching/ap';
import { debug } from '@/domains/system/debug';
import App from './App.vue';
import './registerServiceWorker';
import router from './router';
import '@/assets/styles.scss';

const { init } = useAppInit();

fileFromFS
  .ap(ensureNotNullish)
  .ap(tap(partial(set, mapFileHandler.value(), 'value')))
  .ap(readFileHandler)
  .ap(partial(
    defaultValue,
    `{"current":${JSON.stringify(createMap('current'))}}`,
  ))
  .ap(debug('json as string is'))
  .ap(jsonParse)
  .ap(apToEnd(mapsAll, set, 'value'))
  .ap(debug('all maps is'))
  .ap(init);

// Если файл открыт по ссылке
new Applicative('Открываем по ссылке')
  .ap(console.log);

createApp(App)
  .use(router)
  .use(i18n)
  .mount('#app');
