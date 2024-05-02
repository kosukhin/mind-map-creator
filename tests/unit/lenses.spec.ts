import { lensName } from '@/utils/lensName';
import { lensValue } from '@/utils/lensValue';
import { compose, lensPath, view } from 'ramda';

describe('lenses', () => {
  it('compose', () => {
    const valueName = compose(lensValue, lensName);
    const source = {
      value: {
        name: 'test',
      },
    };
    console.log('value lens', lensValue);
    console.log('test', view(valueName, source));
    expect(true).toBe(true);
  });

  it('undefined', () => {
    const map = {
      value: {
        objects: [],
      },
    };
    expect(view(lensPath(['value', 'none', 'none2']), map)).toBeUndefined();
  });
});
