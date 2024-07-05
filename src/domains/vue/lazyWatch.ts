import { partial } from 'lodash';
import { placeholder } from 'lodash/fp';
import { watch } from 'vue';

export const lazyWatch = (...args: any[]) => partial(watch, placeholder, ...args as [any, any]);
