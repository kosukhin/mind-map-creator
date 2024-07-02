import { useCanvas } from '@/composables/useCanvas';
import { DEFAULT_BOUNDARIES } from '@/constants/system';
import { defaultValue } from '@/domains/application/defaultValue';
import { Applicative } from '@/domains/branching/Applicative';
import { partial } from 'lodash';
import { Vector2d } from '@/entities/Konva';
import { canvasRestrictBoundaries } from '@/application/canvasRestrictBoundaries';
import { tap } from '@/domains/branching/tap';

const { canvasSize } = useCanvas();

export const useCanvasBoundaries = () => ({
  restrictBoundaries(pos: Vector2d) {
    return new Applicative(canvasSize.value)
      .ap(partial(defaultValue, DEFAULT_BOUNDARIES))
      .ap(canvasRestrictBoundaries(pos))
      .ap(tap((value: any) => console.log('restrict', value)))
      .value();
  },
});
