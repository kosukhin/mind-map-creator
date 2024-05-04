import { curry } from 'ramda';
import { Ref } from 'vue';

export const setRef = curry((ref: Ref<any>, newValue: any) => {
  ref.value = newValue;
  return newValue;
});
