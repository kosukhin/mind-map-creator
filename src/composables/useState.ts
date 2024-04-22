import { isRef, ref, Ref } from 'vue';

export const useState = (refOrValue: Ref<any> | any) => {
  if (!isRef(refOrValue)) {
    refOrValue = ref(refOrValue);
  }

  const setter = (value: any) => {
    refOrValue.value = value;
  };

  return [refOrValue, setter];
};
