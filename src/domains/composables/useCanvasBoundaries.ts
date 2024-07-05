import { canvasRestrictBoundaries } from '@/application/canvasRestrictBoundaries';
import { DEFAULT_BOUNDARIES } from '@/constants/system';
import { defaultValue } from '@/domains/application/defaultValue';
import { canvasSize } from '@/domains/data/canvasSize';
import { Vector2d } from '@/entities/Konva';
import { partial } from 'lodash';

export const useCanvasBoundaries = () => ({
  restrictBoundaries(pos: Vector2d) {
    return canvasSize
      .ap(partial(defaultValue, DEFAULT_BOUNDARIES))
      .ap(canvasRestrictBoundaries(pos))
      .value();
  },
});
