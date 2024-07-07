import { createValueApplicative } from '@/domains/application/createValueApplicative';
import { applicative } from '@/domains/branching/Applicative';
import { Size } from '@/entities/Size';
import { ref } from 'vue';

export const canvasSize = applicative(ref<Size>());
export const canvasSizeValue = applicative(
  () => createValueApplicative(canvasSize).value(),
);
