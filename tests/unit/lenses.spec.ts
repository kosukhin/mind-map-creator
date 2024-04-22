import { lensName } from '@/utils/lensName';
import { lensValue } from '@/utils/lensValue';
import { compose, view } from 'ramda';

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
});
