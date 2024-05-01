import { lensPath, view } from 'ramda';
import { applyToLazy } from '@/utils/applyToLazy';

describe('converge', () => {
  it('applyTo', () => {
    const map = {
      objects: ['obj1'],
    };
    const withMap = applyToLazy(map);

    console.log(withMap(view(lensPath(['objects'])))());
  });
});
