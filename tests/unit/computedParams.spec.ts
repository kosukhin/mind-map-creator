import { computedParams } from '@/utils/computedParams';
import { compose } from 'lodash/fp';

describe('computedParams', () => {
  it('should calculate params', () => {
    const addArr = (...arr: number[]) => arr.reduce((a, b) => a + b, 0);
    const sumFn = computedParams(addArr, () => 4, () => 5, () => 6);
    console.log(sumFn());
    expect(sumFn()).toBe(15);
  });
});
