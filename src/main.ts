import i18n from '@/plugins/i18n';
import { createApp } from 'vue';
import { Applicative } from '@/domains/branching/Applicative';
import { fileFromFS } from '@/domains/browser/fileFromFS';
import { readFileHandler } from '@/domains/browser/readFileHandler';
import { jsonParse } from '@/domains/browser/jsonParse';
import partial from 'lodash/partial';
import { set } from 'lodash';
import { mapsAll } from '@/domains/data/mapsAll';
import { initApplication } from '@/domains/applicationHigher/initApplication';
import { ensureNotNullish } from '@/domains/application/ensureNotNullish';
import { mapFileHandler } from '@/domains/data/mapFileHandler';
import { tap } from '@/domains/branching/tap';
import App from './App.vue';
import './registerServiceWorker';
import router from './router';
import '@/assets/styles.scss';

// Если файл открыт из файловой системы
new Applicative()
  .ap(fileFromFS) // Пробуем открыть файл из ФС для PWA
  .ap(ensureNotNullish) // Убеждаемся что получилось открыть файл
  .ap(tap(partial(set, mapFileHandler, 'value'))) // Запоминаем хэндлер файла, чтобы потом управлять файлом
  .ap(readFileHandler) // Читаем содержимое файла
  .ap(jsonParse) // Парсим json файла
  .ap(partial(set, mapsAll, 'value')) // Запоминаем все карты файла
  .ap(initApplication); // Запускаем инициализацию приложения

// Если файл открыт по ссылке
new Applicative('Открываем по ссылке')
  .ap(console.log);

createApp(App)
  .use(router)
  .use(i18n)
  .mount('#app');
