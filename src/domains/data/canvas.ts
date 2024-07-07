import { createValueApplicative } from '@/domains/application/createValueApplicative';
import { applicative } from '@/domains/branching/Applicative';
import { ref } from 'vue';

export const canvas = applicative(ref<HTMLElement>());
export const canvasValue = applicative(
  () => createValueApplicative(canvas).value(),
);
